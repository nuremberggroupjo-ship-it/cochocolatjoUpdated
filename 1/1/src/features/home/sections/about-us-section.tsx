import Image from "next/image"
import { FC } from "react"

import AboutUsMainImage from "@/assets/images/about-us/about-us-11.webp"

import { ReadMore } from "@/components/shared/read-more"

import { SectionWrapper } from "@/features/home/components/section-wrapper"

export const AboutUsSection: FC = () => {
  return (
    <SectionWrapper title="About Us">
      <div className="mx-auto mt-4 mb-6 grid grid-cols-1 gap-6 md:mb-12 md:max-w-[90%] lg:mt-6 lg:grid-cols-2 xl:grid-cols-5">
        {/* image */}
        <div className="lg:col-span-1 xl:col-span-2">
          <Image
            src={AboutUsMainImage.src}
            width={600}
            height={400}
            alt="About Us"
            className="aspect-8/8 w-full rounded-lg object-cover"
          />
        </div>

        {/* content */}
        <div className="flex flex-col gap-6 md:flex-row md:gap-10 lg:col-span-1 lg:flex-col xl:col-span-3">
          {/* our story */}
          <div className="flex flex-col gap-2">
            <h3 className="text-primary text-base tracking-wide uppercase md:text-lg">
              Our Story
            </h3>

            <ReadMore
              text="We are two sisters based in Dubai who, despite our many travels, couldn’t find truly healthy chocolates. Delicious options were everywhere, but healthy? Not really. Driven by curiosity and a love for chocolate, we embarked on a journey with our then sixty-eight-year-old diabetic mother to the beautiful island of Mindanao in the Philippines. There, we studied the very heart of chocolate—cacao—learning to plant, prune, and harvest cacao trees and to ferment their beans. Along the way, we formed friendships with farmers, agriculturists, and government workers who opened our eyes to the realities and challenges of cacao farming. This experience shaped not only our craft but also our values, inspiring us to create chocolate that is as wholesome as it is indulgent."
              maxChars={350}
            />
          </div>

          {/* our mission */}
          <div className="flex flex-col gap-2">
            <h3 className="text-primary text-base tracking-wide uppercase md:text-lg">
              Our Mission
            </h3>
            <ReadMore
              text="We create chocolate that nourishes the body and uplifts the spirit, with a steadfast commitment to health, the fine art of chocolate making, and the communities that make our work possible. Every product begins with pure, natural ingredients—real cacao, free from palm oil, preservatives, and unnecessary additives. We choose natural sweeteners like fruit, coconut sugar, and dates, and incorporate superfoods such as Moringa, grains, and antioxidant-rich ingredients to ensure each bite offers wellness as well as flavor. Guided by the principle of “fewer but better” ingredients, we craft recipes that are low on the glycemic index, rich in nutrients, and rooted in simplicity. The goal is to bring comfort, joy, and health together in every piece of chocolate we make."
              maxChars={300}
            />
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
