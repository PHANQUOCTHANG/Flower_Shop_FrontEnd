export interface ShopConfig {
  shopName: string;
  phone: string;
  email: string;
  address: string;
  slogan: string;
  mapIframeUrl: string;
}

export interface SocialLinks {
  zalo: string;
  facebook: string;
  instagram: string;
  tiktok: string;
}

export interface ChatSettings {
  welcomeMessage: string;
  waitMessage: string;
}

export interface HomeBanner {
  image: string;
  badgeText: string;
  title: string;
  titleHighlight: string;
  description: string;
  primaryBtn: string;
  secondaryBtn: string;
  primaryLink: string;
  secondaryLink: string;
}

export interface AboutPage {
  heroImage: string;
  badgeText: string;
  title: string;
  titleItalic: string;
  description: string[];
  coreValues: CoreValue[];
}

export interface CoreValue {
  title: string;
  description: string;
  iconName: string;
}

export interface BankTransfer {
  bankName: string;
  accountNumber: string;
  accountName: string;
  branch: string;
  qrCodeUrl: string;
}

export interface PaymentConfig {
  bankTransfer: BankTransfer;
}

export interface SystemSettings {
  shopConfig: ShopConfig;
  socialLinks: SocialLinks;
  chatSettings: ChatSettings;
  homeBanners: HomeBanner[];
  aboutPage: AboutPage;
  paymentConfig: PaymentConfig;
}
