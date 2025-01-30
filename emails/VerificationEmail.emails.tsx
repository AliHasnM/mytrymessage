import { Html, Head, Font, Preview, Heading, Row, Section, Text } from "@react-email/components";

// Defines the expected properties for the verification email  
interface VerifcationEmailProps {
    username: string; // User's name to personalize the email  
    otp: string; // One-time password for verification  
}

// Function to generate a verification email template  
export default function VerifcationEmail({ username, otp }: VerifcationEmailProps) {
    return (
        <Html lang="en" dir="ltr"> {/* HTML structure for the email, setting language and direction */}
            <Head>
                <title>Verification Code</title> {/* Title of the email (not always visible in email clients) */}
                <Font 
                    fontFamily="Roboto" 
                    fallbackFontFamily="Verdana" 
                    webFont={{
                        url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2", 
                        format: "woff2"
                    }} 
                    fontWeight={400} 
                    fontStyle="normal" 
                />
            </Head>

            <Preview>Here&apos;s your verification code: {otp}</Preview> {/* Email preview text shown in some email clients */}

            <Section> {/* Main section containing email content */}
                <Row>
                    <Heading as="h2">Hello { username }</Heading> {/* Personalized greeting */}
                </Row>
                <Row>
                    <Text>Thank you for registering. Please use the following verification code to complete your registration:</Text>
                </Row>
                <Row>
                    <Text>{otp}</Text> {/* Displays the OTP code */}
                </Row>
                <Row>
                    <Text>If you did not request this code, please ignore this email.</Text> {/* Security note for the user */}
                </Row>

                {/* Uncomment and use a button if interactive registration is required */}
                {/* <Row>
                    <Button>Complete Registration</Button>
                </Row> */}
            </Section>
        </Html>
    );
}
