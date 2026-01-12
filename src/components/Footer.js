import { BookOpen, Github, Twitter, Instagram } from "lucide-react";

const Footer = () => {
    return (
        <footer className="footer p-10 bg-base-200 text-base-content border-t border-primary/10">
            <aside>
                <div className="flex items-center gap-2 text-primary">
                    <BookOpen size={40} />
                    <p className="text-2xl font-bold">BookWorm</p>
                </div>
                <p className="mt-2 text-neutral-content/60">
                    A personalized book tracking experience.<br />
                    Helping you build your legacy one page at a time.
                </p>
                <div className="flex gap-4 mt-4">
                    <a className="hover:text-primary transition-colors cursor-pointer"><Github size={20} /></a>
                    <a className="hover:text-primary transition-colors cursor-pointer"><Twitter size={20} /></a>
                    <a className="hover:text-primary transition-colors cursor-pointer"><Instagram size={20} /></a>
                </div>
            </aside>
            <nav>
                <h6 className="footer-title text-primary">Platform</h6>
                <a className="link link-hover">Browse Books</a>
                <a className="link link-hover">My Library</a>
                <a className="link link-hover">Tutorials</a>
            </nav>
            <nav>
                <h6 className="footer-title text-primary">Company</h6>
                <a className="link link-hover">About us</a>
                <a className="link link-hover">Contact</a>
                <a className="link link-hover">Privacy Policy</a>
            </nav>
            <nav>
                <h6 className="footer-title text-primary">Newsletter</h6>
                <div className="form-control w-80">
                    <label className="label">
                        <span className="label-text">Enter your email address</span>
                    </label>
                    <div className="join">
                        <input type="text" placeholder="username@site.com" className="input input-bordered join-item w-full" />
                        <button className="btn btn-primary join-item text-white">Subscribe</button>
                    </div>
                </div>
            </nav>
        </footer>
    );
};

export default Footer;
