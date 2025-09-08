import Link from "next/link";
import { FC } from "react";

import { MailIcon, MapPinIcon, PhoneIcon, TimerIcon } from "lucide-react";

import { FOOTER_ADDRESS, SHOP_MAIN_NAV_LIST, SOCIAL_LINKS } from "@/constants";

import {
  ContactItem,
  Copyright,
  FooterSectionWrapper,
 // JoinTheTeamForm,
  SocialIcon,
} from "./components";

export const ShopFooter: FC = () => {
  return (
    <footer
      id="contact"
      className="bg-secondary text-secondary-foreground border-border/50 relative border-t "
    >
      <div className="container p-4 md:p-6 lg:p-8">
        <div className="grid gap-12 md:grid-cols-2 lg:flex  lg:justify-around">
          {/* Contact Information */}
          <FooterSectionWrapper title="Contact Us">
            <address className="space-y-2 text-sm not-italic">
              <ContactItem
                icon={PhoneIcon}
                href={`tel:${FOOTER_ADDRESS.phoneNumber}`}
                label={FOOTER_ADDRESS.phoneNumber}
              />

              <ContactItem
                icon={MailIcon}
                href={`mailto:${FOOTER_ADDRESS.email}`}
                label={FOOTER_ADDRESS.email}
              />
              <div className="flex items-center gap-2">
                <TimerIcon className="h-4 w-4" />
                <span>{FOOTER_ADDRESS.openingHours}</span>
              </div>
              <ContactItem
                icon={MapPinIcon}
                href={FOOTER_ADDRESS.location_link}
                label={FOOTER_ADDRESS.location_label}
              />
            </address>
          </FooterSectionWrapper>

          {/* Shop */}
          <FooterSectionWrapper title="Shop">
            <nav>
              <ul className="space-y-2 text-sm">
                {SHOP_MAIN_NAV_LIST.filter((item) => !item.comingSoon).map(
                  (item) => (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        className="hover:text-primary inline-block transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </nav>
          </FooterSectionWrapper>

          {/* Follow us on social media */}
          <FooterSectionWrapper title="Follow Us">
            <div className="mb-6 flex space-x-4">
              {SOCIAL_LINKS.map((social) => (
                <SocialIcon key={social.id} {...social} />
              ))}
            </div>
          </FooterSectionWrapper>

          {/* Join the team */}
          {/*<FooterSectionWrapper title="Join The Team">
            <JoinTheTeamForm />
          </FooterSectionWrapper>*/}
        </div>
        {/* Copyright */}
        <Copyright />
      </div>
    </footer>
  );
};
