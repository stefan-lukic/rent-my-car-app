import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-black w-full">
      <div className="mx-auto">
        <div className="flex justify-between flex-wrap py-8">
          <div className="text-white space-y-4 max-w-[20%]">
            <h2 className="text-2xl font-bold tracking-wider">Exclusive</h2>
            <h3 className="text-xl font-medium">Subscribe</h3>
            <p className="text-base font-normal">
              Get 10% off your first order
            </p>
            <div className="flex xl:w-44 max-xl:w-full bg-black px-3 py-2 rounded border border-[#FAFAFA] outline outline-transparent focus-within:outline-[#007bff] focus-within:bg-transparent">
              <input
                type="text"
                placeholder="Enter your email"
                className="w-full text-sm font-light bg-transparent rounded outline-none pr-2"
              />
              <Image
                src="/icons/vector.svg"
                height={16}
                width={16}
                alt="search"
                className=""
              />
            </div>
          </div>
          <div className="flex flex-col text-white space-y-4 max-w-[20%]">
            <h2 className="text-xl font-medium">Support</h2>
            <a href="#" className="text-base font-normal">
              111 Bijoy sarani, Dhaka, DH 1515, Bangladesh
            </a>
            <a href="#" className="text-base font-normal">
              exclusive@gmail.com
            </a>
            <a href="#" className="text-base font-normal">
              +88015-88888-9999
            </a>
          </div>
          <div className="flex flex-col text-white space-y-4 max-w-[20%]">
            <h2 className="text-xl font-medium">Account</h2>
            <a href="/account" className="text-base font-normal">
              My Account
            </a>
            <a href="/sign-in" className="text-base font-normal">
              Login / Register
            </a>
            <a href="/cart" className="text-base font-normal">
              Cart
            </a>
            <a href="/wishlist" className="text-base font-normal">
              Wishlist
            </a>
            <a href="/" className="text-base font-normal">
              Shop
            </a>
          </div>
          <div className="flex flex-col text-white space-y-4 max-w-[20%]">
            <h2 className="text-xl font-medium">Quick Link</h2>
            <a href="#" className="text-base font-normal">
              Privacy Policy
            </a>
            <a href="#" className="text-base font-normal">
              Terms Of Use
            </a>
            <a href="#" className="text-base font-normal">
              FAQ
            </a>
            <a href="/contact" className="text-base font-normal">
              Contact
            </a>
          </div>
          <div className="text-white space-y-4 max-w-[20%]">
            <h2 className="text-xl font-medium">Download App</h2>
            <div className="flex flex-col justify-center gap-2 w-48">
              <p className="text-xs text-[var(--secondary)]">
                Save $3 with App New User Only
              </p>
              <div className="flex gap-2 h-20 w-full">
                <div className="">
                  <Image
                    src="/icons/qr-code.svg"
                    height={100}
                    width={100}
                    alt="qr code"
                    className="h-full w-full"
                  />
                </div>
                <div className="flex flex-col justify-center gap-2">
                  <div className="">
                    <Image
                      src="/icons/google-play-store.svg"
                      height={100}
                      width={100}
                      alt="qr code"
                      className="h-full w-full"
                    />
                  </div>
                  <div className="">
                    <Image
                      src="/icons/app-store.svg"
                      height={100}
                      width={100}
                      alt="qr code"
                      className="h-full w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-between max-w-36">
              <div>
                <Image
                  src="/icons/facebook.svg"
                  width={24}
                  height={24}
                  alt="facebook"
                  className="h-full w-full"
                />
              </div>
              <div>
                <Image
                  src="/icons/twitter.svg"
                  width={24}
                  height={24}
                  alt="facebook"
                  className="h-full w-full bg-black"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-[0.5px] border-gray-700" />
      <div className="container mx-auto flex-center text-white/[0.3] py-4 font-normal">
        &copy; Copyright Rimel 2022. All right reserved
      </div>
    </footer>
  );
};
export default Footer;
