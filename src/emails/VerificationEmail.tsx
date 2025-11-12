import {
  Body,
  Container,
  Font,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export const VerificationEmail = ({
  username,
  verificationCode,
}: {
  username: string;
  verificationCode: string;
}) => {
  return (
    <Html lang="en">
      <Head>
        <title>Email Verification Code</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>

      <Preview>
        Welcome to Mira! Your verification code is {verificationCode}
      </Preview>

      <Body style={main}>
        <Container style={container}>
          <Section style={logo}>
            <Img
              src="https://your-logo-url.png"
              width="160"
              height="50"
              alt="Mira"
            />
          </Section>

          <Section style={content}>
            <Heading style={heading}>Welcome {username}! 👋</Heading>
            <Text style={paragraph}>
              Thank you for joining <strong>Mira</strong>. Please use the code
              below to verify your email address.
            </Text>

            <Section style={codeContainer}>
              <Text style={code}>{verificationCode}</Text>
            </Section>

            <Text style={paragraph}>
              This code will expire in <strong>10 minutes</strong>. If you
              didn’t request this, you can safely ignore this email.
            </Text>

            <Text style={footer}>
              Cheers,
              <br />
              The Mira Team
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// ✨ Inline Styles
const main = {
  backgroundColor: "#f9fafb",
  fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "32px 0",
  borderRadius: "8px",
  maxWidth: "580px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
};

const logo: React.CSSProperties = {
  textAlign: "center",
  marginBottom: "24px",
};

const content = {
  padding: "0 40px",
};

const heading: React.CSSProperties = {
  fontSize: "26px",
  fontWeight: "600",
  color: "#111827",
  textAlign: "center",
  marginBottom: "20px",
};

const paragraph: React.CSSProperties = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#4b5563",
  textAlign: "center",
};

const codeContainer: React.CSSProperties = {
  backgroundColor: "#f3f4f6",
  borderRadius: "6px",
  padding: "20px 0",
  margin: "30px 0",
  textAlign: "center",
};

const code = {
  fontSize: "36px",
  fontWeight: "700",
  color: "#111827",
  letterSpacing: "6px",
};

const footer: React.CSSProperties = {
  fontSize: "14px",
  lineHeight: "24px",
  color: "#6b7280",
  textAlign: "center",
  marginTop: "32px",
};

export default VerificationEmail;
