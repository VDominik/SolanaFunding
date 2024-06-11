import "./about.css";
import webIcon from "./internet.png";
import discordIcon from "./logo.png";
import xIcon from "./twitter.png";
import mailIcon from "./mail.png";
const About = () => {
  return (
    <>
      <div className="about-page-wrapper">
        <div className="about-page">
        <div className="about-hero-section">
          <div className="about-image">
            <h2 className="about-hero-heading">Bringing The Solana Community Together</h2>

          </div>
        </div>
        <div className="about-content">
          <h2>About Solario</h2>
          <i>Bringing The Solana Community Together</i>
          <br />
          <br />
          At Solario, we harness the power of community to create meaningful impact. Our platform is a hub where dreams are nurtured and causes find their champions. Whether you're an aspiring entrepreneur, a creative artist, or passionate about making a difference, Solario is your launchpad to success.

          {/* Our Mission Empowering Dreams, Building Futures Our mission is to empower
          individuals and communities by providing a platform where innovative
          ideas and impactful projects can thrive. We envision a world where
          every dream, no matter how big or small, has the chance to become a
          reality through the collective support of a global community. Our
          Journey The story of Solario began with a shared vision to democratize
          funding and bring people together for a common purpose. Founded in
          [Year], our team embarked on a mission to create a crowdfunding
          platform that transcends boundaries and connects creators with backers
          who believe in their vision. Meet the Team Our team is made up of
          passionate individuals with diverse backgrounds and expertise. From
          developers and designers to community managers, each member plays a
          crucial role in shaping the Solario experience. Get to know the faces
          behind the platform and discover the shared commitment that drives us
          forward. Core Values Transparency, Trust, and Innovation At Solario,
          we uphold values that form the foundation of our platform.
          Transparency in our operations, trust in our community, and a
          commitment to continuous innovation guide every decision we make. We
          prioritize the security and well-being of our users, ensuring a safe
          and supportive environment for all. Your Journey with Solario Solario
          is more than just a crowdfunding platform; it's a community of
          like-minded individuals who believe in the power of collective action.
          Whether you're here to launch a campaign, discover exciting projects,
          or be part of a supportive network, we invite you to explore and be
          part of the Solario journey. Join Us on Social Media Stay connected
          with us on social media for the latest updates, success stories, and
          community highlights. <br /> */}

          <h2>How to use Solario</h2>
          Solario offers unique benefits for both creators and backers. Here’s how to get started:

          <h3>Set up your Campaign</h3>
          Easily launch your campaign by clicking the "Create a Campaign" button. In just minutes, you can start raising funds for your project.

          <h3>Contribute to a Campaign</h3>
          Discover exciting projects and contribute to those you believe in. Simply open a campaign, enter your donation amount, and click the "Donate" button.

          <h3>Accessing Donations</h3>
          Donated funds are available to campaign owners immediately. In the future, we plan to implement a feature where funds are only withdrawable after campaign completion, ideal for product or service development campaigns.
         
          <h3>Transparency with Donors</h3>
          We value transparency. Each campaign displays a list of donors, allowing everyone to see who has contributed to making dreams a reality.

          <h3>Fees</h3>
          Solario charges a 5% donor fee to support platform maintenance and growth. We empower creators by charging 0% creator and withdrawal fees, ensuring they receive the full amount raised.          <br />
          
          <h3>Follow Us</h3>
          Join the conversation on social media. Follow us on [Facebook], [Twitter], and [Instagram] to stay updated with the latest news, campaigns, and success stories from the Solario community.
          <br />

          <h3>Contact Us</h3>
          We're here to help. Reach out at [contact@solario.app] or
          use our <a href="/feedback">Contact Form</a>.
          <br />
          <br />
          <br /> 
          Thank you for being part of the Solario community!
          </div>
        </div>
        <div className="why-icons-wrapper">
          <div className="why-icon-wrapper">
            <img src={webIcon} alt=""></img>
            <div className="why-icon-easy">
            </div>
            <p>solario.app</p>
          </div>
          <div className="why-icon-wrapper">
            <img src={discordIcon} alt=""></img>
            <div className="why-icon-cheap">
            </div>
            <p><a href="https://www.discord.gg/cZCjqhdy8x">discord.gg/cZCjqhdy8x</a></p>
          </div>
          <div className="why-icon-wrapper">
            <img src={xIcon} alt=""></img>
            <div className="why-icon-fast">
            </div>
            <p>@solarioapp</p>
          </div>
          <div className="why-icon-wrapper">
            <img src={mailIcon} alt=""></img>
            <div className="why-icon-easy">
            </div>
            <p>info@solario.app</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
