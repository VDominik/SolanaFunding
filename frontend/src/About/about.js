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
          At Solario, we believe in the power of community and the ability of
          individuals to create meaningful impact. Our platform is a space where
          dreams are nurtured, and causes find their champions. Whether you're
          an aspiring entrepreneur, a creative artist, or someone passionate
          about making a difference, Solario is your launchpad to success.

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
          Solario offers several key benefits that make it an ideal platform for creators and backers alike. Here's how you can get started:

          <h3>Set up your Campaign</h3>
          With Solario you can easily set up a campaign just by clicking "Create a campaing" button. You can set up your campaign in a matter of minutes and start raising funds for your project.

          <h3>Contribute to a Campaign</h3>
          Discover exciting projects and contribute to the ones you believe in. Simply open the Campaign, enter the amount you want to donate and click the "Donate" button.
          
          <h3>Funds from the Donations</h3>
          Funds that are donated to the campaign are available to the owner righr after the donation is made. The owner can withdraw the funds at any time.
          Our future plans are to implement a feature where the owner can withdraw the funds only after the campaign is completed. This would be more suitable for campaigns that are for building a product or a service.
         
          <h3>List of Donors</h3>
          We believe in transparency. Each campaign displays a list of donors, allowing everyone to see who has contributed to making dreams a reality.
         
         <h3>Fees</h3>
         Solario charges a 5% donor fee to support the maintenance and growth of our platform. However, we believe in empowering creators, which is why we charge 0% creator and withdrawal fees. This means creators can access the funds they need without any deductions.
          <br />
          <h3>Follow Us</h3>
          Join the conversation on social media. Follow us on [Facebook], [Twitter], and [Instagram] to stay updated with the latest news, campaigns, and success stories within the Solario community.
          <br />
          <h3>Want to get in touch with our team? </h3>
          We're here to help. Reach out to us at [contact@solario.app] or
          use our <a href="/feedback">Contact Form</a>. Thank you for being part of the Solario
          community!
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
            <p><a href="https://www.discord.gg/cZCjqhdy8x">discord link</a></p>
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
