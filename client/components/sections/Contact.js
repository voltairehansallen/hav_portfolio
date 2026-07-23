import Panel from '../ui/Panel';
import { Mail } from 'lucide-react';
import ContactForm from './ContactForm';
import api from '../../lib/api';
import { socialIcon } from '../../lib/socialIcon';

async function getSocialLinks() {
  try {
    const { data } = await api.get('/social-links');
    return data;
  } catch {
    return [];
  }
}

export default async function Contact() {
  const socialLinks = await getSocialLinks();

  return (
    <Panel id="contact" label="CONTACT.sh" title="Contact" icon={<Mail size={14} />}>
      <ContactForm />

      {socialLinks.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-4 border-t border-panel-border pt-6 font-mono text-sm">
          {socialLinks.map((link) => {
            const Icon = socialIcon(link.platform);
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-muted transition-colors hover:text-vision"
              >
                <Icon size={14} /> {link.platform.toLowerCase()}
              </a>
            );
          })}
        </div>
      )}
    </Panel>
  );
}
