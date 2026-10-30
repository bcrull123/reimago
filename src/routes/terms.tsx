import { createFileRoute } from "@tanstack/react-router";
import { Clause, LegalArticle } from "@/components/legal-article";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalArticle
      kicker="Legal notices"
      title="Terms of Service"
      lede="reimago.ai is operated by REIMAGO, Inc., a subsidiary of Catalog.com, Inc. These are the REIMAGO, Inc. Terms and Conditions, kept on this site, together with a notice that covers the Reimagine draft. The canonical user terms remain published at the address below."
    >
      <p>
        Canonical user terms:{" "}
        <a className="underline underline-offset-4" href="https://reimago.ai/help/tos.one">
          https://reimago.ai/help/tos.one
        </a>
        . Operator terms are on the{" "}
        <a className="underline underline-offset-4" href="/operator-terms">
          operator terms
        </a>{" "}
        page. Submitting a signup request, or using the REIMAGO network of websites, is agreement to these terms.
      </p>

      <Clause heading="Reimagine draft — additional notice">
        <p>
          The form on the homepage asks for a website address, an email, and what you want changed. Sending it
          authorizes REIMAGO to fetch publicly available pages at that address, and one related page on the same
          domain, solely to prepare a draft homepage. Do not submit an address you are not allowed to have read.
          Do not include passwords. The draft is a concept, shown in your browser. It does not replace the live
          site, and it is not a promise of traffic, revenue, or a finished build.
        </p>
        <p>
          Sending the form emails the website address, your email, and your note to marketing@reimago.ai.
          The subject is the website domain. Your email address is the first line of that message.
          Children under 13 may not use REIMAGO. The warranties, liability limits, and Oklahoma dispute terms
          below apply to the draft the same way they apply to the rest of the sites.
        </p>
      </Clause>

      <Clause heading="1. This is an agreement between you and REIMAGO, Inc.">
        <p>
          This is an agreement (“Agreement”) between you (“USER”) and REIMAGO, Inc., a subsidiary of Catalog.com,
          Inc. (“REIMAGO”). This Agreement governs your use of any website or web page operated by REIMAGO (each,
          a “REIMAGO Site,” and collectively, the “REIMAGO Sites”) and the purchase of any product or service
          offered by REIMAGO.
        </p>
        <p>
          USER hereby certifies to REIMAGO that USER is at least 13 years old. If USER is a parent and REIMAGO is
          used by the entire family, you agree to supervise the usage of any child under 13. Children under 13 are
          not permitted to join REIMAGO or participate in the REIMAGO Groups.
        </p>
        <p>
          REIMAGO offers the REIMAGO websites to you conditioned on your acceptance without modification of this
          Agreement. Your use of the REIMAGO websites constitutes your acceptance of this Agreement. This
          Agreement contains disclaimers of warranties and liability (see sections 13, 14, and 15) and an exclusive
          remedy (see section 14). These provisions form the essential basis of our agreement.
        </p>
      </Clause>

      <Clause heading="2. How REIMAGO may modify this agreement">
        <p>
          REIMAGO may amend this agreement at any time, without notice, by posting the amended terms on
          reimago.ai. The link is labeled Legal and is at the bottom of the home page. You are responsible for
          regularly reviewing these terms. Continued use after the effective date of a change is acceptance of
          that change.
        </p>
      </Clause>

      <Clause heading="3. Additional terms">
        <p>
          Any REIMAGO site may contain additional terms that further govern use of that site, including particular
          features or offers. If any terms in this Agreement conflict with terms on a REIMAGO website, the terms
          in this Agreement prevail.
        </p>
      </Clause>

      <Clause heading="4. Free domain and sub-domain">
        <p>
          REIMAGO may offer domain names and sub-domains (such as user.reimago.ai) (“Free Domain(s)”) to select
          users for no additional fees. All Free Domains will be registered by REIMAGO and any rights in them are
          retained by REIMAGO. Based on service level, a user may be granted certain non-exclusive rights to use
          the Free Domain. A user who wants to purchase a Free Domain they are using may ask REIMAGO to sell it.
          If REIMAGO agrees to sell, the price is set by REIMAGO in its sole discretion. Users are not obligated
          to purchase. REIMAGO may stop providing Free Domains, use them for other purposes, or offer them to
          other users.
        </p>
      </Clause>

      <Clause heading="5. Free web hosting and ad revenue">
        <p>
          REIMAGO may offer free web hosting, including weblogs, email, and other services (“Free Hosting”) to
          select users. Free Hosting will be ad based. REIMAGO has the right to display ads on the user website,
          including the right to link ads to user original material. All revenue generated by those ads is the
          property of REIMAGO.
        </p>
      </Clause>

      <Clause heading="6. Content submitted or made available for inclusion on the REIMAGO network">
        <p>
          REIMAGO does not claim ownership of Content you submit or make available for inclusion on the REIMAGO
          Network using the REIMAGO software. The REIMAGO software is called SOCIALCORE™. With respect to Content
          you submit or make available on publicly accessible areas of the REIMAGO Network using SOCIALCORE, you
          grant REIMAGO a world-wide, royalty-free, non-exclusive, perpetual, irrevocable, and fully sublicensable
          license to use, distribute, reproduce, modify, adapt, publish, translate, publicly perform, and publicly
          display that Content (in whole or in part) and to incorporate it into other works in any format or
          medium now known or later developed.
        </p>
        <p>
          “Publicly accessible” areas are those areas of the REIMAGO network of domains and sub-domains that
          REIMAGO intends to be available to the general public, including addresses such as anyusername.reimago.ai
          and portions open to both members and visitors. They do not include pages that are merely linked but are
          not hosted or served by REIMAGO.
        </p>
        <p>
          REIMAGO does not claim ownership of Content you submit on your paid hosting website. If you fail to pay
          an outstanding balance for the domain name or web hosting, you grant REIMAGO the same license described
          above in that Content, and you forfeit ownership of the domain name to REIMAGO.
        </p>
      </Clause>

      <Clause heading="7. Purchasing or transferring a domain name or purchasing web hosting">
        <p>
          By purchasing a new domain name, transferring an existing domain name, or purchasing web hosting or any
          other service at REIMAGO, Inc., a subsidiary of Catalog.com, Inc., an ICANN-accredited registrar, you
          agree to the Catalog.com, Inc. terms at{" "}
          <a className="underline underline-offset-4" href="http://www.catalog.com/legal.html">
            http://www.catalog.com/legal.html
          </a>{" "}
          and to the terms of the applicable top-level domain registry. Registries named in the published terms
          include Verisign (.com and .net), NeuLevel (.biz), NeuStar (.us), Afilias (.info), Public Interest
          Registry (.org), Website.ws (.ws), and Nominet UK (.uk). The full registry list in the canonical terms
          controls if this summary and that page differ.
        </p>
      </Clause>

      <Clause heading="8. Member conduct">
        <p>
          You understand that all information, data, text, software, music, sound, photographs, graphics, video,
          messages, or other materials (“Content”), whether publicly posted or privately transmitted, are the sole
          responsibility of the person from whom the Content originated. You, and not REIMAGO, are entirely
          responsible for Content that you upload, post, email, transmit, or otherwise make available. REIMAGO
          does not control Content posted via the Service and does not guarantee its accuracy, integrity, or
          quality. You may be exposed to Content that is offensive, indecent, or objectionable. Under no
          circumstances will REIMAGO be liable for any Content, including errors or omissions, or for any loss or
          damage resulting from use of Content made available via the Service.
        </p>
        <p>You agree not to use the Service to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            upload, post, email, transmit, or otherwise make available any Content that is unlawful, harmful,
            threatening, abusive, harassing, tortious, defamatory, vulgar, obscene, libelous, invasive of
            another’s privacy, hateful, or racially, ethnically, or otherwise objectionable;
          </li>
          <li>harm minors in any way;</li>
          <li>
            impersonate any person or entity, including a REIMAGO official, forum leader, guide, or host, or
            misrepresent your affiliation with a person or entity;
          </li>
          <li>forge headers or otherwise manipulate identifiers in order to disguise the origin of any Content;</li>
          <li>
            make available Content you do not have a right to make available under any law or under contractual or
            fiduciary relationships;
          </li>
          <li>
            make available Content that infringes any patent, trademark, trade secret, copyright, or other
            proprietary rights of any party;
          </li>
          <li>
            make available any unsolicited or unauthorized advertising, junk mail, spam, chain letters, or pyramid
            schemes, except in areas designated for that purpose;
          </li>
          <li>
            make available any material that contains software viruses or any other code designed to interrupt,
            destroy, or limit the functionality of any computer software, hardware, or telecommunications
            equipment;
          </li>
          <li>
            disrupt the normal flow of dialogue or otherwise act in a manner that negatively affects other users’
            ability to engage in real-time exchanges;
          </li>
          <li>
            interfere with or disrupt the Service or servers or networks connected to the Service, or disobey any
            requirements of networks connected to the Service;
          </li>
          <li>
            intentionally or unintentionally violate any applicable local, state, national, or international law,
            including regulations of the U.S. Securities and Exchange Commission and the rules of any national
            securities exchange;
          </li>
          <li>
            provide material support or resources, or conceal or disguise the nature, location, source, or
            ownership of material support or resources, to any organization designated by the United States
            government as a foreign terrorist organization pursuant to section 219 of the Immigration and
            Nationality Act;
          </li>
          <li>“stalk” or otherwise harass another; and/or</li>
          <li>
            collect or store personal data about other users in connection with the prohibited conduct above.
          </li>
        </ul>
        <p>
          Technical processing and transmission of the Service, including your Content, may involve transmissions
          over various networks and changes to conform and adapt to technical requirements. You may not attempt to
          override or circumvent usage rules embedded into the Service. Any unauthorized reproduction, publication,
          further distribution, or public exhibition of the materials on the Service is strictly prohibited.
          Recognizing the global nature of the Internet, you agree to comply with all local rules regarding online
          conduct and acceptable Content, including laws regarding the transmission of technical data exported from
          the United States or the country in which you reside.
        </p>
      </Clause>

      <Clause heading="9. Spam is prohibited">
        <p>
          REIMAGO prohibits use of the REIMAGO Services in any manner associated with the transmission,
          distribution, or delivery of any unsolicited bulk or unsolicited commercial email (“Spam”). You may not
          use any REIMAGO service to send Spam, and you may not deliver Spam or cause Spam to be delivered to any
          REIMAGO service or REIMAGO customer.
        </p>
        <p>
          Email sent, or caused to be sent, to or through the REIMAGO Services may not use or contain invalid or
          forged headers; use or contain invalid or non-existent domain names; misrepresent, hide, or obscure any
          information identifying the point of origin or the transmission path; use other means of deceptive
          addressing; use a third party’s internet domain name, or be relayed from or through a third party’s
          equipment, without permission; contain false or misleading information in the subject line or otherwise
          contain false or misleading content; fail to comply with additional technical standards; or otherwise
          violate REIMAGO’s Terms of Use.
        </p>
        <p>
          REIMAGO does not authorize the harvesting, mining, or collection of email addresses or other information
          from or through the REIMAGO Services. REIMAGO does not permit or authorize others to use the REIMAGO
          Services to collect, compile, or obtain any information about its customers or subscribers, including
          subscriber email addresses, which are REIMAGO’s confidential and proprietary information.
        </p>
        <p>
          REIMAGO does not permit any attempt to use the Services in a manner that could damage, disable,
          overburden, or impair any aspect of the Services, or interfere with any other party’s use. If REIMAGO
          believes unauthorized or improper use is being made, it may, without notice, take action it deems
          appropriate, including blocking messages from a particular internet domain, mail server, or IP address,
          and it may immediately terminate any account it determines is transmitting or is otherwise connected
          with email that violates this policy. Nothing in this policy grants any right to transmit email to or
          through the REIMAGO Services. Failure to enforce this policy in every instance is not a waiver.
          Unauthorized use in connection with unsolicited email may result in civil, criminal, or administrative
          penalties against the sender and those assisting the sender.
        </p>
      </Clause>

      <Clause heading="10. Materials you post; communications monitoring">
        <p>
          REIMAGO may or may not pre-screen Content, but REIMAGO and its designees have the right (but not the
          obligation) in their sole discretion to pre-screen, refuse, or move any Content available via the
          Service, and to remove any Content that violates the terms or is otherwise objectionable. You must
          evaluate, and bear all risks associated with, the use of any Content, including any reliance on its
          accuracy, completeness, or usefulness. You may not rely on any Content created by REIMAGO or submitted
          to REIMAGO, including information in REIMAGO message boards and in all other parts of the Service.
        </p>
        <p>
          You acknowledge, consent, and agree that REIMAGO may access, preserve, and disclose your account
          information and Content if required to do so by law or in a good-faith belief that such access,
          preservation, or disclosure is reasonably necessary to comply with legal process and to enforce the
          Terms of Service. The remainder of this sentence, as published, is in the canonical terms.
        </p>
      </Clause>

      <Clause heading="11. Software">
        <p>
          Your use of any software associated with the REIMAGO websites is governed by the end user license
          agreement (“EULA”) accompanying that software. If you receive software that is not accompanied by a
          EULA, REIMAGO grants you a non-exclusive, revocable, personal, non-transferable license to use that
          software solely in connection with the REIMAGO websites and in accordance with this Agreement. REIMAGO
          reserves all rights not expressly granted. Such software is protected by copyright and other
          intellectual property laws and treaties. REIMAGO or its suppliers own the title, copyright, and other
          intellectual property rights in the software, and the software is licensed, not sold. You will not
          disassemble, decompile, or reverse engineer the software, except and only to the extent that activity is
          expressly permitted by applicable law. REIMAGO may automatically check your version and may automatically
          download upgrades to update, enhance, and further develop the REIMAGO websites.
        </p>
      </Clause>

      <Clause heading="12. Information available from the REIMAGO websites">
        <p>
          REIMAGO and its suppliers do not warrant the accuracy or timeliness of any information available from
          the REIMAGO websites, including stock quotes, even if that information appears in email, pager, cell
          phone, or other alerts. REIMAGO and its suppliers do not authorize use of that information, including
          stock quotes or other financial information, for any purpose other than your personal use, and prohibit
          to the maximum extent allowable the resale, redistribution, and commercial use of this information.
          REIMAGO is not a broker-dealer or registered investment advisor and does not advise individuals as to
          the advisability of investing in, purchasing, or selling securities or other financial products.
          Nothing on the REIMAGO websites constitutes an offer or solicitation to buy or sell any security.
          REIMAGO does not endorse any particular product or service. Nothing on the sites is intended to
          constitute professional advice, including investment or tax advice.
        </p>
      </Clause>

      <Clause heading="13. REIMAGO makes no warranty">
        <p>
          REIMAGO provides the REIMAGO network of websites “as is,” “with all faults,” and “as available,” and the
          entire risk as to satisfactory quality, performance, accuracy, and effort is with you. To the maximum
          extent permitted by applicable law, the REIMAGO parties make no representations, warranties, or
          conditions, express or implied. The REIMAGO parties disclaim any and all warranties or conditions,
          express, statutory, and implied, including without limitation (1) warranties or conditions of
          merchantability, fitness for a particular purpose, workmanlike effort, accuracy, title, quiet enjoyment,
          no encumbrances, no liens, and non-infringement, (2) warranties or conditions arising through course of
          dealing or usage of trade, and (3) warranties or conditions that access to or use of the REIMAGO
          websites will be uninterrupted or error-free. There are no warranties that extend beyond the face of
          this Agreement.
        </p>
      </Clause>

      <Clause heading="14. Liability limitation; your exclusive remedy">
        <p>
          In no event will any REIMAGO party be liable for any damages, including without limitation any indirect,
          consequential, special, incidental, or punitive damages arising out of, based on, or resulting from this
          Agreement or your use of the REIMAGO websites, even if that REIMAGO party has been advised of the
          possibility of such damages. The exclusion of damages under this section is independent of your
          exclusive remedy and survives if that remedy fails of its essential purpose or is otherwise deemed
          unenforceable. These limitations and exclusions apply without regard to whether the damages arise from
          (1) breach of contract, (2) breach of warranty, (3) negligence, or (4) any other cause of action, to the
          extent the exclusion and limitations are not prohibited by applicable law. If you are dissatisfied with
          the REIMAGO websites, you do not agree with any part of this Agreement, or you have any other dispute or
          claim with or against any REIMAGO party with respect to this Agreement or the websites, then your sole
          and exclusive remedy is to discontinue using the REIMAGO websites.
        </p>
      </Clause>

      <Clause heading="15. Changes to the REIMAGO websites; additional liability limitation">
        <p>
          The REIMAGO parties may change the REIMAGO websites or delete features in any way, at any time, and for
          any reason. As you use the websites, you should expect to receive content originated by REIMAGO and by
          persons other than REIMAGO (“Third Parties”). Without limiting sections 13 and 14, you agree that the
          REIMAGO parties are not responsible or liable for (1) any content, including infringing, inaccurate,
          obscene, indecent, threatening, offensive, defamatory, tortious, or illegal content, or (2) any third
          party conduct, transmissions, or data. REIMAGO is not responsible or liable for (1) any viruses or other
          disabling features that affect your access to or use of the websites, (2) any incompatibility between
          the REIMAGO websites and other websites, services, software, and hardware, (3) any delays or failures
          you may experience in initiating, conducting, or completing any transmissions or transactions in an
          accurate or timely manner, or (4) any damages or costs of any type arising out of or in any way
          connected with your use of any services available from third parties through links on the websites. The
          limitations, exclusions, and disclaimers in sections 13, 14, and 15 apply to the maximum extent
          permitted by applicable law, and are not intended to deprive you of any mandatory protections provided
          under applicable law.
        </p>
      </Clause>

      <Clause heading="16. Termination; access restriction">
        <p>
          REIMAGO may terminate this Agreement, or terminate or suspend your access to the REIMAGO websites at any
          time, with or without cause, with or without notice. Upon termination or suspension, your right to use
          the websites will immediately cease. Any information you have stored on the REIMAGO websites may not be
          retrieved later.
        </p>
      </Clause>

      <Clause heading="17. Interpreting the agreement; assignment">
        <p>
          If any part of this Agreement is held invalid or unenforceable, the invalid provision will be deemed
          superseded by a valid, enforceable provision that most closely matches the intent of the original, and
          the remainder will continue in effect. REIMAGO may assign this Agreement, in whole or in part, at any
          time with or without notice to you. You may not assign this Agreement or sublicense your rights, if any,
          in the websites. Except as expressly stated, this Agreement is the entire agreement between you and
          REIMAGO with respect to the websites and it supersedes all prior or contemporaneous communications and
          proposals, whether electronic, oral, or written. Section titles are for convenience only and have no
          legal or contractual significance.
        </p>
      </Clause>

      <Clause heading="18. You have limited time to bring your claim">
        <p>
          You agree that, regardless of any statute or law to the contrary, any claim or cause of action arising
          out of or related to use of the REIMAGO websites or this Agreement must be filed within the limited time
          stated in the canonical terms, or be permanently barred. Read that limitation in the published terms
          before you rely on a longer period.
        </p>
      </Clause>

      <Clause heading="19. Copyright and trademark notices">
        <p>
          All contents of the REIMAGO websites are Copyright © 2005 REIMAGO Corporation and/or its suppliers,
          14000 Quail Springs Parkway, Suite 3600, Oklahoma City, OK 73134 U.S.A. Platform and Social Network
          Engine content © 2010 Reimago, Inc. Later site notices: Copyright © 2020 Reimago, Inc. All rights
          reserved. All Platform marks, including SOCIALCORE, are marks of REIMAGO or its suppliers.
        </p>
      </Clause>

      <Clause heading="20. Third-party account information">
        <p>
          By using a toolbar menu through the REIMAGO websites, you authorize REIMAGO and its agents to access
          third-party sites designated by you, or on your behalf, to retrieve information requested by you, and
          you appoint REIMAGO and its agents as your agent for this limited purpose. You are advised to use any
          information at your own risk.
        </p>
      </Clause>

      <Clause heading="21. Copyright complaints">
        <p>
          Pursuant to Title 17, United States Code, Section 512(c)(2), notifications of claimed copyright
          infringement should be sent to the service provider’s designated agent. Inquiries not relevant to that
          procedure will receive no response. The notice and procedure for making claims of copyright infringement
          is published at{" "}
          <a
            className="underline underline-offset-4"
            href="http://hosting.catalog.com/copyright_infringement.html"
          >
            http://hosting.catalog.com/copyright_infringement.html
          </a>
          .
        </p>
      </Clause>

      <Clause heading="22. Privacy statement">
        <p>
          Users shall be bound by the Catalog.com, Inc. privacy statement, published at{" "}
          <a
            className="underline underline-offset-4"
            href="http://hosting.catalog.com/privacy_policy.html"
          >
            http://hosting.catalog.com/privacy_policy.html
          </a>
          , and by the privacy notice on this site.
        </p>
      </Clause>

      <Clause heading="23. Resolution of disputes">
        <p>
          For the adjudication of all disputes concerning or arising from the service and facilities provided
          under this agreement (other than use of a registered name), all litigation shall be commenced in a state
          or federal court sitting in Oklahoma County, Oklahoma. Irrespective of the conflict-of-laws doctrine,
          this Agreement shall be governed, construed, and enforced pursuant to the laws of the State of Oklahoma.
        </p>
        <p>
          I have read the terms and conditions above, and I hereby agree to all terms by submitting my signup
          request to REIMAGO, Inc. or by using the REIMAGO, Inc. network of websites.
        </p>
      </Clause>
    </LegalArticle>
  );
}
