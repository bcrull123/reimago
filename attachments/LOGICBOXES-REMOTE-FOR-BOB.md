# LogicBoxes from a host with no static IP

Hand this whole file to the AI building the new site. It is the contract for talking to Webhero's domain registrar. The proxy described here is the only supported way in.

Webhero will send two things separately, not in this file:

- the base URL (expected: `https://secure.webhero.com/api/logicboxes.php`)
- a proxy token


---

## Why a direct call will fail

LogicBoxes (the HTTP API at `https://httpapi.com`) checks two things on every call:

1. The reseller API key and reseller id.
2. The **source IP** of the caller, against an allowlist on the reseller account.

A key alone is not enough. A call from an IP that is not on that list is rejected even when the key is valid.

The new site's AI runs in the cloud outside of Webhero's network and has no static egress address. That address changes, so it cannot be added to the allowlist. Putting the LogicBoxes key on that host would also put a registrar credential on a machine we do not control.

Call the Webhero proxy. The proxy runs on a host LogicBoxes already allowlists. It holds the key. Your token only proves you are allowed to ask the proxy to make the call.

## Where the proxy sits

Production already reaches privileged Webhero services through **whmaster01**, published as `https://secure.webhero.com`. The alpha site does this today via`https://secure.webhero.com/api/…` with an `X-API-Key` header. whmaster then talks to Oracle.

**herohq** (the Virtualmin node that runs webhero.com) already uses that same door to whmaster. Bob's site uses it too. There is no SSH hop and no Virtualmin login in this design. herohq is the reason we know a remote caller can reach whmaster; the new piece is one more endpoint on that API, with its own token, that forwards to LogicBoxes.

```
new site (any IP, Google Cloud)
    |  HTTPS, X-API-Key = proxy token
    v
whmaster01  (secure.webhero.com)
    |  HTTPS out through the F5 (already allowlisted)
    |  proxy adds api-key and auth-userid
    v
https://httpapi.com/api/<endpoint>
```

Calls from `secure.webhero.com` leave through the F5, and those addresses are already on the LogicBoxes allowlist. On the server the script is `/var/webhero/api/logicboxes.php` on whmaster01.

The existing control-panel bridge key is a different secret and must not be reused for this. It can read and write billing data. This proxy gets its own token, and that token can only do the calls listed below.

---

## What you send

`POST` the proxy URL.

Headers:

```
Content-Type: application/json
X-API-Key: <proxy token Webhero issues>
Accept: application/json
```

Body:

```json
{
  "env": "live",
  "method": "GET",
  "endpoint": "domains/available.json",
  "params": {
    "domain-name": ["example"],
    "tlds": ["com", "net"]
  }
}
```

| Field | Required | Values |
|---|---|---|
| `env` | yes | `live` or `test`. Use `live` for reads. Checked 1 Nov 2026: `test` returns Access Denied because that reseller's allowlist does not include the F5. A `live` write spends real money. |
| `method` | yes | `GET` or `POST`, and it must match the endpoint below. |
| `endpoint` | yes | Path only, from the allowlist. Example: `domains/available.json`. No scheme, no host, no `..`. |
| `params` | yes | Object of LogicBoxes parameters for that endpoint. Use a JSON array when LogicBoxes wants the same key repeated. |

Do not send `api-key`, `auth-userid`, `customer-id`, or `invoice-option`. The proxy sets those. If you send them, the proxy drops them and uses its own values.

`test` goes to `https://test.httpapi.com`. `live` goes to `https://httpapi.com`. They are different reseller accounts. A contact id or order id from `test` is useless on `live`. The F5 addresses are allowlisted on the live account only. Until WebHero says the test account is open, `env: test` fails with Access Denied. Use `live` for availability, suggest, details, and price. Do not point a failed test write at `live`.

The proxy turns JSON arrays into the repeated query keys LogicBoxes expects (`domain-name=example&tlds=com&domain-name=example&tlds=net`), with no `[]` brackets. Send arrays. Do not pre-build the query string.

## What you get back

HTTP status from the proxy, and a JSON body:

```json
{
  "ok": true,
  "env": "test",
  "endpoint": "domains/available.json",
  "status": 200,
  "data": { }
}
```

`data` is the LogicBoxes JSON, unchanged.

| Proxy HTTP status | Meaning |
|---|---|
| 200 | LogicBoxes accepted the call. Still read `data`. LogicBoxes sometimes returns an error object with HTTP 200. |
| 400 | Body was not the shape above, or `method` does not match the endpoint. |
| 401 | Missing or wrong `X-API-Key`. |
| 403 | `endpoint` is not on the allowlist. |
| 502 | The proxy could not complete the call to LogicBoxes. `data` may contain their error message. |

On an empty body or a timeout, retry a read (availability, suggest, details, price) up to 3 times. Do not retry a register, renew, transfer, or privacy purchase. Those can succeed on the first try and still look failed to you, and a second call spends again.

---

## Calls you may make

Reads, either env:

| Endpoint | Method | Params you send | Notes |
|---|---|---|---|
| `domains/available.json` | GET | `domain-name` (array of SLDs), `tlds` (array of TLDs, same length and order) | One entry per name you are checking. `example` + `com` asks about `example.com`. |
| `domains/v5/suggest-names.json` | GET | `keyword`, `tld-only` (array), `exact-match` (`true` or `false`) | Suggestions only. |
| `domains/details-by-name.json` | GET | `domain-name`, `options` (use `OrderDetails`) | Live order for a domain we already sponsor. |
| `domains/customer-price.json` | GET | `tld` | One TLD per call. This is registrar cost, not the price Webhero charges the customer. |

Writes bill WebHero on `live`. The test account is not accepting calls yet, so do not send these at all until WebHero says to. A paid order is not enough by itself.

| Endpoint | Method | Params you send |
|---|---|---|
| `contacts/add.json` | POST | `name`, `company`, `email`, `address-line-1`, `address-line-2`, `city`, `state`, `country`, `zipcode`, `phone-cc`, `phone`, and for `.us` the nexus attrs below |
| `domains/register.json` | POST | `domain-name`, `years`, `ns`, `reg-contact-id`, `admin-contact-id`, `tech-contact-id`, `billing-contact-id`, `purchase-privacy` |
| `domains/renew.json` | POST | `order-id`, `years`, `exp-date` |
| `domains/transfer.json` | POST | `domain-name`, `auth-code`, `reg-contact-id`, `admin-contact-id`, `tech-contact-id`, `billing-contact-id`, `purchase-privacy` |
| `domains/purchase-privacy.json` | POST | `order-id` |

Anything else returns 403. That includes `domains/delete.json`, nameserver changes, contact changes, and every reseller-admin call. Ask Webhero if the new site needs one of those. Do not work around the allowlist.

The proxy forces these on every write, overwriting anything you sent:

- `customer-id` — the Webhero customer for that env (live `16169818`, test `16169993`)
- `invoice-option` — `NoInvoice`. We bill the customer. LogicBoxes must not.
- `ns`, when you omit it — `ns1.webhero.com`, `ns2.webhero.com`, `ns3.webhero.com`

Pass a different `ns` only when the customer asked for other nameservers.

## Rules that match how Webhero already registers domains

**Premium names.** In an availability result, `status: "available"` plus a `costHash` means a premium name. Do not offer it and do not register it. Webhero drops those. They can cost hundreds or thousands of dollars.

**`.us` contacts.** LogicBoxes rejects a `.us` register or transfer unless the registrant contact has an application purpose and a nexus category:

```json
"attr-name1": "purpose",
"attr-value1": "P1",
"attr-name2": "category",
"attr-value2": "C11"
```

`attr-value1` is the purpose code (`P1` through `P5`). `attr-value2` is the nexus category (`C11`, `C12`, `C21`, `C31`, `C32`). Collect both from the customer before `contacts/add.json`. A contact created without them cannot be used to register a `.us` name.

**Contact ids.** `contacts/add.json` returns a contact id. A registration needs four ids (reg, admin, tech, billing). The same id may be used for all four when the customer is all of those roles. Ids from `test` do not work on `live`.

**Renewals.** Call `domains/details-by-name.json` first. Renew with that order's `orderid` as `order-id` and that order's `endtime` as `exp-date`. Do not guess the expiry.

**Transfers.** `auth-code` is the EPP code from the losing registrar. After a successful transfer call, LogicBoxes still has to finish the transfer. Do not mark the name active on our side just because this call returned success.

**Privacy.** `purchase-privacy` is `true` or `false` on register and transfer. For a name we already have, use `domains/purchase-privacy.json` with the order id. Not every TLD supports it.

**Search order.** When showing several TLDs for one name, Webhero's signup checks `com`, `net`, `org`, `us`, `info`, `biz`, `co`, `io` in that order.

## Availability example

Request:

```json
{
  "env": "live",
  "method": "GET",
  "endpoint": "domains/available.json",
  "params": {
    "domain-name": ["example", "example", "example"],
    "tlds": ["com", "net", "org"]
  }
}
```

A normal `data` object looks like this (fields vary by TLD):

```json
{
  "example.com": { "status": "regthroughothers" },
  "example.net": { "status": "available" },
  "example.org": { "status": "available", "costHash": { } }
}
```

Treat only `status == "available"` and no `costHash` as something we can sell. `regthroughothers` and `regthroughus` are taken.

## Register example

Shape only. Do not send these yet. `env: test` returns Access Denied today, and retrying them as `live` would bill WebHero. The proxy fills in `customer-id` and `invoice-option`.

```json
{
  "env": "test",
  "method": "POST",
  "endpoint": "contacts/add.json",
  "params": {
    "name": "Jane Customer",
    "company": "Example Inc",
    "email": "jane@example.com",
    "address-line-1": "1 Main St",
    "address-line-2": "",
    "city": "Oklahoma City",
    "state": "OK",
    "country": "US",
    "zipcode": "73102",
    "phone-cc": "1",
    "phone": "4055550100"
  }
}
```

```json
{
  "env": "test",
  "method": "POST",
  "endpoint": "domains/register.json",
  "params": {
    "domain-name": "example-test-name.com",
    "years": "1",
    "reg-contact-id": "12345",
    "admin-contact-id": "12345",
    "tech-contact-id": "12345",
    "billing-contact-id": "12345",
    "purchase-privacy": "false"
  }
}
```

## What not to do

- Do not call `httpapi.com` or `test.httpapi.com` from Google Cloud.
- Do not store a LogicBoxes `api-key` or reseller id in the new site, its env, its repo, or the model context.
- Do not use the control-panel bridge key (`X-API-Key` on the db-query / auth-login endpoints) as this token.
- Reads use `env: live`. Do not send a contact, register, renew, transfer, or privacy call until WebHero says to. `env: test` currently returns Access Denied. Do not retry that write with `env: live`.
- Do not register, renew, transfer, or buy privacy before the customer has paid. Those calls charge Webhero whether or not our checkout finished.
- Do not log the proxy token.

The token will be rotated if it shows up in a repo, a chat log, or a client bundle. Ask Webhero for a new one. Do not try to recover the old one from anywhere else.
