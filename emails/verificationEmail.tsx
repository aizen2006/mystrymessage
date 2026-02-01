import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

interface VerificationEmailProps {
  firstName?: string;
  code: string;
  expiryMinutes?: number;
  companyName?: string;
  supportEmail?: string;
}

export default function VerificationEmail({
  firstName,
  code,
  expiryMinutes = 15,
  companyName = 'MystryMessage',
  supportEmail = 'support@genexecutive.xyz',
}: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-[#f4f6f8] font-sans text-[#374151]">
          <Preview>Email Verification - {companyName}</Preview>
          <Container className="p-5 mx-auto max-w-[600px]">
            <Section className="bg-white rounded-lg shadow-sm overflow-hidden">
              <Section className="py-6 px-6 text-center border-b border-[#e5e7eb]">
                <Heading className="text-[#111827] text-xl font-bold m-0">
                  {companyName}
                </Heading>
                <Text className="text-[#6b7280] text-sm mt-2 mb-0 mx-0">
                  Email Verification Code
                </Text>
              </Section>
              <Section className="py-8 px-8">
                <Text className="text-[#374151] text-base mb-3 mt-0 mx-0">
                  {firstName ? `Hi ${firstName},` : 'Hello,'}
                </Text>
                <Text className="text-[#374151] text-[15px] leading-[1.6] mt-0 mb-4 mx-0">
                  Please use the verification code below to confirm your email
                  address. This code is valid for{' '}
                  <strong>{expiryMinutes} minutes</strong>.
                </Text>
                <Section className="flex items-center justify-center my-6">
                  <Text className="text-[#374151] m-0 font-bold text-center text-sm">
                    Verification code
                  </Text>
                  <Text className="text-[#374151] text-[28px] my-4 mx-0 font-bold text-center tracking-[6px] font-mono bg-[#f3f4f6] py-4 px-8 rounded-lg">
                    {code}
                  </Text>
                  <Text className="text-[#374151] text-sm m-0 text-center">
                    (This code is valid for {expiryMinutes} minutes)
                  </Text>
                </Section>
                <Text className="text-[#6b7280] text-[13px] mt-0 mb-4 mx-0">
                  If you didn&apos;t request this verification, you can safely
                  ignore this email or contact us at{' '}
                  <Link
                    href={`mailto:${supportEmail}`}
                    className="text-[#2563eb] underline"
                  >
                    {supportEmail}
                  </Link>
                  .
                </Text>
                <Text className="text-[#374151] text-sm mt-6 mb-0 mx-0">
                  Regards,
                  <br />
                  <strong>{companyName} Team</strong>
                </Text>
              </Section>
              <Hr className="border-[#e5e7eb]" />
              <Section className="py-4 px-8 bg-[#fafafa] text-center">
                <Text className="text-[#9ca3af] text-xs m-0">
                  © {new Date().getFullYear()} {companyName}. All rights reserved.
                </Text>
              </Section>
            </Section>
            <Text className="text-[#9ca3af] text-xs mt-3 mb-0 px-5 py-0">
              This is an automated message. Please do not reply.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

VerificationEmail.PreviewProps = {
  firstName: 'Alex',
  code: '596853',
  expiryMinutes: 15,
  companyName: 'MystryMessage',
  supportEmail: 'support@genexecutive.xyz',
} satisfies VerificationEmailProps;
