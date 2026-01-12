const Footer = () => {
    return (
        <footer className="footer footer-center p-10 bg-neutral text-neutral-content rounded-t-[3rem] mt-20">
            <aside>
                <div className="p-3 bg-white/10 rounded-2xl mb-4">
                    <svg width="50" height="50" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" className="fill-current text-primary">
                        <path d="M23 5v14c0 1.104-.896 2-2 2h-18c-1.104 0-2-.896-2-2v-14c0-1.104.896-2 2-2h18c1.104 0 2 .896 2 2zm-5.4 8h-3.2l-1.4 1.4-1.4-1.4h-3.2l-1.4 1.4-1.4-1.4v4h13.4v-4z"></path>
                    </svg>
                </div>
                <p className="font-black text-xl tracking-widest uppercase">BookWorm</p>
                <p className="font-medium opacity-60">Providing an extraordinary reading experience since 2024</p>
                <p className="opacity-40">Copyright © 2026 - All right reserved</p>
            </aside>
        </footer>
    );
};

export default Footer;
