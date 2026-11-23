export interface TermsSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  closing?: string[];
}

export const TERMS_OF_USE = {
  version: '2026-11-23',
  title: 'Terms of Use',
  updated: 'Last updated: 23 November 2026',
  intro: [
    'These terms apply when you use the Ethora mobile app and the chat workspaces you join with it. The app is provided by Dappros Ltd, trading as Ethora, a company registered in England and Wales under company number 11455432, 38 Munden Grove, Watford, WD24 7EE, United Kingdom ("Ethora", "we").',
    'By tapping "I agree" you accept these terms. If you do not agree, do not register or sign in.',
  ],
  sections: [
    {
      heading: '1. Who can use the app',
      paragraphs: [
        'You must be at least 16 years old. You are responsible for your account and for everything sent from it, so keep your sign-in details private.',
      ],
    },
    {
      heading: '2. Workspaces',
      paragraphs: [
        'Workspaces in the app are run by Ethora or by organisations that use Ethora. A workspace owner may have additional rules and may moderate its workspace. These terms apply in every workspace.',
      ],
    },
    {
      heading: '3. No tolerance for objectionable content or abusive users',
      paragraphs: [
        'There is no tolerance for objectionable content or abusive users in Ethora. You must not send, post or share content that:',
      ],
      bullets: [
        'is illegal or promotes illegal activity;',
        'harasses, bullies, threatens or intimidates anyone;',
        'is hateful or discriminatory, or attacks people for their race, ethnicity, nationality, religion, gender, sexual orientation, disability or age;',
        'is sexually explicit, or sexualises minors in any way;',
        'shows or encourages violence, self-harm or terrorism;',
        'is spam, a scam or malware, or impersonates another person;',
        "infringes someone else's privacy, copyright or other rights.",
      ],
      closing: ['You must not use the app to abuse, stalk or harm other users in any other way.'],
    },
    {
      heading: '4. Reporting and blocking',
      paragraphs: [
        "To report objectionable content, use Report in a chat's menu. To block a user, open their profile or the private chat with them and tap Block. Blocking removes their private chats from your chat list and hides their messages from you at once, and our moderators are notified. You can unblock users in Settings, Blocked users.",
      ],
    },
    {
      heading: '5. Moderation',
      paragraphs: [
        'We review reports within 24 hours. When content breaks these terms, we remove it and suspend or close the account of the user who posted it. Workspace owners can also remove content and members in their workspaces. We may act without notice when content or behaviour puts others at risk.',
      ],
    },
    {
      heading: '6. Your content',
      paragraphs: [
        'You are responsible for what you send. You keep the rights to your content and allow us to store, process and deliver it to the people you send it to, as needed to run the service.',
      ],
    },
    {
      heading: '7. Privacy',
      paragraphs: [
        'Our Privacy Policy explains how we handle personal data: https://ethora.com/privacy-policy/',
      ],
    },
    {
      heading: '8. Ending your use',
      paragraphs: [
        'You can stop using the app at any time and delete your account in the app settings. We may suspend or close your account if you break these terms.',
      ],
    },
    {
      heading: '9. Liability',
      paragraphs: [
        'The app is provided "as is". To the extent the law allows, we are not responsible for content posted by other users and are not liable for indirect or consequential loss. Nothing in these terms limits your rights under consumer law.',
      ],
    },
    {
      heading: '10. Changes',
      paragraphs: [
        'We may update these terms. If a change is significant, the app will ask you to accept the new terms.',
      ],
    },
    {
      heading: '11. Law',
      paragraphs: [
        'These terms are governed by the laws of England and Wales, subject to the mandatory consumer rights of the country where you live.',
      ],
    },
    {
      heading: '12. Contact',
      paragraphs: ['Questions and reports: support@ethora.com. Legal matters: legal@ethora.com.'],
    },
  ] as TermsSection[],
};
