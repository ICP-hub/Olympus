export default function getPlatformFromHostname(hostname) {
  if (hostname.includes('linkedin.com')) {
    return 'LinkedIn';
  } else if (hostname.includes('twitter.com')) {
    return 'Twitter';
  } else if (hostname.includes('github.com')) {
    return 'GitHub';
  } else if (hostname.includes('t.me') || hostname.includes('telegram')) {
    return 'Telegram';
  } else if (hostname.includes('facebook.com')) {
    return 'Facebook';
  } else if (hostname.includes('instagram.com')) {
    return 'Instagram';
  } else if (hostname.includes('youtube.com')) {
    return 'YouTube';
  } else if (hostname.includes('reddit.com')) {
    return 'Reddit';
  } else if (hostname.includes('tiktok.com')) {
    return 'TikTok';
  } else if (hostname.includes('snapchat.com')) {
    return 'Snapchat';
  } else if (hostname.includes('whatsapp.com')) {
    return 'WhatsApp';
  } else if (hostname.includes('medium.com')) {
    return 'Medium';
  } else {
    return hostname; // Use the domain as the key if not recognized
  }
}
