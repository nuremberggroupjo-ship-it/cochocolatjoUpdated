import type { Metadata } from "next"
import Image from "next/image"

import AboutUs1Image from "@/assets/images/about-us/about-us-1.webp"
import AboutUs2Image from "@/assets/images/about-us/about-us-2.webp"
import AboutUs3Image from "@/assets/images/about-us/about-us-3.webp"
import AboutUs4Image from "@/assets/images/about-us/about-us-4.webp"
import AboutUs5Image from "@/assets/images/about-us/about-us-5.webp"
import AboutUs6Image from "@/assets/images/about-us/about-us-6.webp"
import AboutUs7Image from "@/assets/images/about-us/about-us-7.webp"

import { PAGE_METADATA, createMetadata } from "@/constants"

export const metadata: Metadata = createMetadata(PAGE_METADATA.aboutUs)

export default function AboutUsPage() {
  return (
    <main className="mx-auto my-4">
      {/* First Image */}
      <div className="mx-auto mb-8 flex max-w-xl justify-center">
        <Image
          src={AboutUs1Image.src}
          alt="Our Beginning"
          width={800}
          height={600}
          className=""
        />
      </div>

      {/* Our Beginning Section */}
      <section className="mx-auto mb-12 max-w-7xl text-center">
        <h2 className="font-melody-southern-script mb-6 text-2xl font-bold md:text-3xl lg:text-4xl">
          Our Beginning
        </h2>
        <p className="text-left text-lg leading-relaxed">
          We are two sisters based in Dubai who couldn&apos;t find truly healthy
          chocolates despite our many travels. Delicious, there were many, but
          healthy? Not really. So together, with our then-sixty-eight-year-old
          diabetic mother, we traveled to the beautiful island of Mindanao,
          Philippines, to study the main ingredient of chocolate: cacao. We
          learned how to plant, prune, and harvest cacao trees and ferment their
          beans. On this trip, we became friends with farmers, agriculturists,
          and government workers who opened our eyes to the realities of cacao
          farming.
        </p>
      </section>

      {/* Images 2, 3, 4 */}
      <div className="mx-auto mb-12 flex max-w-xl flex-col gap-6">
        <div className="flex justify-center">
          <Image
            src={AboutUs2Image.src}
            alt="Cacao Journey"
            width={400}
            height={300}
            className="h-auto w-full"
          />
        </div>
        <div className="flex justify-center">
          <Image
            src={AboutUs3Image.src}
            alt="Learning Process"
            width={400}
            height={300}
            className="h-auto w-full"
          />
        </div>
        <div className="flex justify-center">
          <Image
            src={AboutUs4Image.src}
            alt="Community Connection"
            width={400}
            height={300}
            className="h-auto w-full"
          />
        </div>
      </div>

      {/* Commitments Section */}
      <section className="mb-12 text-center">
        <div className="font-questrial space-y-3 text-xl font-semibold md:text-2xl">
          <p>We are committed to health.</p>
          <p>
            We are committed to the fine art of chocolate making and cocoa
            gastronomy.
          </p>
          <p>We are committed to the community.</p>
        </div>
      </section>

      {/* Fifth Image */}
      <div className="mb-12 flex justify-center">
        <Image
          src={AboutUs5Image.src}
          alt="Our Commitment"
          width={600}
          height={400}
          className=""
        />
      </div>

      {/* Quote Section */}
      <section className="mb-8 text-center">
        <blockquote className="font-melody-southern text-xl italic md:text-2xl">
          &ldquo;An ounce of prevention is worth a pound of cure.&rdquo;
        </blockquote>
      </section>

      {/* Health Food Section */}
      <section className="mx-auto mb-12 max-w-7xl text-center">
        <h3 className="mb-6 text-xl font-bold md:text-2xl">
          Health Food and Drinks are Not &lsquo;luxurious&rsquo;
        </h3>
        <p className="text-left text-lg leading-relaxed">
          We all know that exercise and proper diet are the foundation of a
          healthy body. We also all know the evil of consuming refined sugar and
          foods that contain much of it, and that includes the (so-called)
          chocolates in the grocery counters that give us so much comfort.
          Chocolates are VERY hard to resist. WE KNOW.
        </p>
      </section>

      {/* Images 6 and 7 */}
      <div className="mx-auto mb-12 flex max-w-xl flex-col gap-6">
        <div className="flex justify-center">
          <Image
            src={AboutUs6Image.src}
            alt="Healthy Chocolate Making"
            width={500}
            height={400}
            className="h-auto w-full"
          />
        </div>
        <div className="flex justify-center">
          <Image
            src={AboutUs7Image.src}
            alt="Natural Ingredients"
            width={500}
            height={400}
            className="h-auto w-full"
          />
        </div>
      </div>

      {/* Final Section */}
      <section className="mx-auto max-w-7xl text-center">
        <p className="text-left text-lg leading-relaxed">
          All our chocolate products are made from 100% natural ingredients,
          real cacao, palm oil-free, and with no preservatives. This explains
          the short shelf-life and limited production quantity. We strive to
          achieve the principle of &lsquo;fewer but better&rsquo; ingredients.
          After all, healthy food is basically simple, including chocolates.
        </p>
        <br />
        <p className="text-left text-lg leading-relaxed">
          So, aside from using our hero ingredient, cacao, or cocoa, which comes
          from our own social agricultural enterprise, you will see from our
          product line and recipes that we use many superfood ingredients in our
          recipes. We prefer to use fruit, coconut sugar, and dates as natural
          sweeteners, but when we cannot avoid the use of sweet poison, also
          known as refined sugar, we use it very minimally. We are committed to
          ensuring that each bite may either relieve stress, enhance mood, serve
          as antioxidants, boost energy, improve the immune system, be
          anti-inflammatory, mildly relieve pain, enhance vitality, improve gut
          flora, or promote heart health. We are hard-core fans of antioxidants,
          fibers, grains, dates, Moringa, Oleic acid (hello, olive oil), and
          other ancient healing ingredients, and this is reflected in our
          recipes. They were created primarily from a health viewpoint, which
          sets us far apart from other confectioners and chocolate makers. Every
          chocolate is made to score low in both the GI index and GL index.
        </p>
      </section>
    </main>
  )
}
