// components/Footer.jsx
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Us Column */}
          <div>
            <h3 className="text-xl font-bold mb-4">About Us</h3>
            <ul>
              <li className="mb-2">
                <Link href="/community-support" className="hover:text-yellow-400 transition-colors">
                  Community Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow Us Column */}
          <div>
            <h3 className="text-xl font-bold mb-4">Follow Us</h3>
            <ul>
              <li className="mb-2">
                <Link href="/help-center" className="hover:text-yellow-400 transition-colors">
                  Help Center
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/twitter" className="hover:text-yellow-400 transition-colors">
                  Twitter Updates
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/instagram" className="hover:text-yellow-400 transition-colors">
                  Instagram Feed
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/blog" className="hover:text-yellow-400 transition-colors">
                  Read our Latest Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Facebook Page Column */}
          <div>
            <h3 className="text-xl font-bold mb-4">Facebook Page</h3>
            <ul>
              <li className="mb-2">
                <Link href="/careers" className="hover:text-yellow-400 transition-colors">
                  Career Opportunities
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/blog" className="hover:text-yellow-400 transition-colors">
                  Latest Blog Posts
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information Column */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Information</h3>
            <ul>
              <li className="mb-2">
                <Link href="/pro" className="hover:text-yellow-400 transition-colors">
                  Upgrade to PRO
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/join" className="hover:text-yellow-400 transition-colors">
                  Join the
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/stories" className="hover:text-yellow-400 transition-colors">
                  Visual Stories on
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} influenz. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;