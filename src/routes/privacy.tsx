import { createFileRoute, Link } from "@tanstack/react-router";
import { Clause, LegalArticle } from "@/components/legal-article";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalArticle
      kicker="Legal notices"
      title="Privacy"
      lede="Users of REIMAGO are bound by the Catalog.com, Inc. privacy statement. This page states that incorporation and describes what this redesigned reimago.ai actually does with information."
    >
      <p>
        Catalog.com privacy statement, incorporated by the{" "}
        <Link to="/terms" className="underline underline-offset-4">
          Terms of Service
        </Link>
        :{" "}
        <a
          className="underline underline-offset-4"
          href="http://hosting.catalog.com/privacy_policy.html"
        >
          http://hosting.catalog.com/privacy_policy.html
        </a>
        . Questions: sales@reimago.ai or (405) 753-5300. REIMAGO, Inc., a subsidiary of Catalog.com, Inc., 14000
        Quail Springs Parkway, Suite 3600, Oklahoma City, OK 73134.
      </p>

      <Clause heading="What this site collects">
        <p>
          The Reimagine form asks for a website address, an email address, and a note about what you want
          changed. Submitting emails those three fields to marketing@reimago.ai. The subject is the website
          domain, and the email address you entered is the first line of the message. The website address and
          the note are also sent to REIMAGO’s server so the public pages can be fetched and a draft can be
          written. The email address is not sent to the model that writes the draft. “Email this brief” opens
          your own email program if you want to send a copy yourself.
        </p>
        <p>
          If you choose “Email this brief to sales,” your own mail program opens a message to sales@reimago.ai.
          That message is ordinary email. We do not run a separate mailing list from this page, and we do not
          sell the information you type here.
        </p>
      </Clause>

      <Clause heading="The crawl">
        <p>
          When you submit a website address, REIMAGO requests the public page, follows ordinary redirects on that
          site, and may request one related page on the same domain. The text of those pages is used to write the
          draft. Grok Build also makes two photographs for that draft from the same text. The pages, the draft,
          and the photographs are not kept as a customer database. A short-lived copy of a finished draft may be
          kept in server memory so the same address and the same note are not regenerated over and over. Your
          browser may also keep the last draft locally on your device until you clear site data.
        </p>
      </Clause>

      <Clause heading="Children">
        <p>
          Children under 13 are not permitted to join REIMAGO or to use this site. Do not submit a child’s
          personal information.
        </p>
      </Clause>

      <Clause heading="Cookies and the draft in your browser">
        <p>
          This marketing site does not set an advertising cookie and does not ask you to create an account. The
          last draft is stored with local storage in your browser, which you can clear. Standard server logs,
          kept by the host that serves the site, may include IP address and the page requested, the way any
          public website does.
        </p>
      </Clause>

      <Clause heading="Disclosure">
        <p>
          As the terms already say, REIMAGO may access, preserve, and disclose account information and content if
          required by law or in a good-faith belief that it is reasonably necessary to comply with legal process
          or to enforce the Terms of Service. Subscriber email addresses held by REIMAGO are confidential.
          REIMAGO does not authorize harvesting of email addresses from the service.
        </p>
      </Clause>

      <Clause heading="Contact">
        <p>
          Privacy questions and copyright notices go to sales@reimago.ai, or by mail to the Oklahoma City address
          above. Copyright complaints follow the procedure linked from the terms. Disputes are governed by the
          laws of the State of Oklahoma, as the terms provide.
        </p>
      </Clause>
    </LegalArticle>
  );
}
