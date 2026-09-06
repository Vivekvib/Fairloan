export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 prose prose-slate">
      <h1>Prototype Disclaimer</h1>
      <p className="lead">
        FairLoan is an educational product-management portfolio project built by
        Vivek Nishad. It is not a real lending product.
      </p>
      <h2>What this prototype is</h2>
      <ul>
        <li>A demonstration of responsible digital-lending UX design</li>
        <li>Built using synthetic data only</li>
        <li>Designed to show product management thinking — discovery, design, prioritisation, and technical implementation</li>
        <li>A reference for how a transparent lending experience could work</li>
      </ul>
      <h2>What this prototype is not</h2>
      <ul>
        <li>A real lender or lending platform</li>
        <li>RBI-compliant or legally regulated in any way</li>
        <li>Suitable for real loan applications or financial decisions</li>
        <li>Collecting real personal, financial, or identity data</li>
      </ul>
      <h2>Regulatory reference</h2>
      <p>
        This prototype references the RBI Master Directions on Digital Lending
        (2022) for design inspiration only. References are labelled as
        &quot;regulatory requirement,&quot; &quot;recommended practice,&quot; or
        &quot;prototype assumption.&quot; Do not treat any content here as legal
        or regulatory advice.
      </p>
      <p>
        Official source:{" "}
        <a
          href="https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=12957"
          target="_blank"
          rel="noopener noreferrer"
        >
          RBI Digital Lending Guidelines
        </a>
      </p>
    </div>
  );
}
