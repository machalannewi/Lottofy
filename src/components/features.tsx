import Tag from "@/components/Tag";
import FeatureCard from "@/components/FeaturesCard";
import avatar1 from "@/assets/images/three-old-raffle-tickets-isolated-white-background.jpg";
import avatar2 from "@/assets/images/two-tickets-blue-front-view-isolated-white.jpg";
import avatar3 from "@/assets/images/green-raffle-tickets.jpg";
import avatar4 from "@/assets/images/two-yellow-tickets.jpg";
import Image from "next/image";
import Avatar from "@/components/Avatar";
import Key from "@/components/Key";

export default function Features() {
  return (
    <section className="py-24 px-6">
      <div className="container">
        <div className="flex justify-center">
          <Tag>How it works</Tag>
        </div>
        <h2 className="text-4xl md:text-6xl font-medium text-center mt-6 max-w-2xl mx-auto">
          Getting your <span className="text-lime-400">ticket</span> is easier
          than you think
        </h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-3 gap-8">
          <FeatureCard
            title="Pick a draw"
            description="Choose the upcoming draw date you want to enter."
            className="md:col-span-2 lg:col-span-1 group"
          >
            <div className="aspect-video flex items-center justify-center">
              <Avatar className="z-40 hover:scale-110 transition duration-500">
                <Image
                  src={avatar1}
                  alt="Avatar 1"
                  className="rounded-full"
                ></Image>
              </Avatar>
              <Avatar className="-ml-6 border-indigo-500 z-30 hover:scale-110 transition duration-500">
                <Image
                  src={avatar2}
                  alt="Avatar 2"
                  className="rounded-full"
                ></Image>
              </Avatar>
              <Avatar className="-ml-6 border-amber-500 z-20 hover:scale-110 transition duration-500">
                <Image
                  src={avatar3}
                  alt="Avatar 3"
                  className="rounded-full"
                ></Image>
              </Avatar>
              <Avatar className="-ml-6 border-transparent group-hover:border-lime-400 transition duration-500 hover:scale-110">
                <div className="relative size-full bg-neutral-700 rounded-full inline-flex items-center justify-center gap-1">
                  <Image
                    src={avatar4}
                    alt="Avatar 4"
                    className="absolute rounded-full opacity-0 group-hover:opacity-100 transition ease-in-out duration-500"
                  />
                  {Array.from({ length: 3 }).map((_, i) => {
                    return (
                      <span
                        key={i}
                        className="size-1.5 rounded-full bg-white"
                      ></span>
                    );
                  })}
                </div>
              </Avatar>
            </div>
          </FeatureCard>
          <FeatureCard
            title="Generate a ticket"
            description="We instantly generate a unique free ticket for you."
            className="md:col-span-2 lg:col-span-1 group"
          >
            <div className="aspect-video flex items-center justify-center gap-4">
              <Key className="w-12 group-hover:outline outline-2 outline-offset-4 outline-lime-400 group-hover:translate-y-1 transition duration-200">
                3
              </Key>
              <Key className="w-12 group-hover:outline outline-2 outline-offset-4 outline-lime-400 group-hover:translate-y-1 transition duration-200 delay-150">
                21
              </Key>
              <Key className="w-12 group-hover:outline outline-2 outline-offset-4 outline-lime-400 group-hover:translate-y-1 transition duration-200 delay-300">
                34
              </Key>
              <Key className="w-12 group-hover:outline outline-2 outline-offset-4 outline-lime-400 group-hover:translate-y-1 transition duration-200 delay-300">
                7
              </Key>
              <Key className="w-12 group-hover:outline outline-2 outline-offset-4 outline-lime-400 group-hover:translate-y-1 transition duration-200 delay-300">
                89
              </Key>
            </div>
          </FeatureCard>
          <FeatureCard
            title="Wait for results"
            description="Winners are picked and posted after the draw closes."
            className="md:col-span-2 lg:col-span-1 md:col-start-2 lg:col-start-auto group"
          >
            <div className="aspect-video flex items-center justify-center">
              <Image
                src={avatar4}
                alt="Avatar 4"
                className="rounded-lg h-36"
              ></Image>
            </div>
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}
