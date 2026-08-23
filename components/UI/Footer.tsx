import Image from 'next/image';
import l from '@/helper/en';

const Footer = () => {
  return (
    <footer className="bg-black w-full">
      <div className="mx-auto">
        <div className="flex justify-between flex-wrap py-8">
          <div className="text-white space-y-4 max-w-[20%]">
            <h2 className="text-2xl font-bold tracking-wider">
              {l.footer.exclusive}
            </h2>
            <h3 className="text-xl font-medium">{l.footer.subscribe}</h3>
            <p className="text-base font-normal">{l.footer.get10Off}</p>
            <div className="flex xl:w-44 max-xl:w-full bg-black px-3 py-2 rounded border border-[#FAFAFA] outline outline-transparent focus-within:outline-[#007bff] focus-within:bg-transparent">
              <input
                type="text"
                placeholder={l.footer.enterYourEmail}
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
            <h2 className="text-xl font-medium">{l.footer.support}</h2>
            <a href="#" className="text-base font-normal">
              {l.footer.address}
            </a>
            <a href="#" className="text-base font-normal">
              {l.footer.email}
            </a>
            <a href="#" className="text-base font-normal">
              {l.footer.phone}
            </a>
          </div>
          <div className="flex flex-col text-white space-y-4 max-w-[20%]">
            <h2 className="text-xl font-medium">{l.footer.account}</h2>
            <a href="/account" className="text-base font-normal">
              {l.footer.myAccount}
            </a>
            <a href="/sign-in" className="text-base font-normal">
              {l.footer.loginRegister}
            </a>
            <a href="/cart" className="text-base font-normal">
              {l.footer.cart}
            </a>
            <a href="/wishlist" className="text-base font-normal">
              {l.footer.wishlist}
            </a>
            <a href="/" className="text-base font-normal">
              {l.footer.shop}
            </a>
          </div>
          <div className="flex flex-col text-white space-y-4 max-w-[20%]">
            <h2 className="text-xl font-medium">{l.footer.quickLink}</h2>
            <a href="#" className="text-base font-normal">
              {l.landing.privacyPolicy}
            </a>
            <a href="#" className="text-base font-normal">
              {l.footer.termsOfUse}
            </a>
            <a href="#" className="text-base font-normal">
              {l.footer.faq}
            </a>
            <a href="/contact" className="text-base font-normal">
              {l.footer.contact}
            </a>
          </div>
          <div className="text-white space-y-4 max-w-[20%]">
            <h2 className="text-xl font-medium">{l.footer.downloadApp}</h2>
            <div className="flex flex-col justify-center gap-2 w-48">
              <p className="text-xs text-[var(--secondary)]">
                {l.footer.save3WithApp}
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
                  alt="twitter"
                  className="h-full w-full bg-black"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-[0.5px] border-gray-700" />
      <div className="container mx-auto flex-center text-white/[0.3] py-4 font-normal">
        {l.footer.copyrightRimel}
      </div>
    </footer>
  );
};
export default Footer;
