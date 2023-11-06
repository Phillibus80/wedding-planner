import {useGetMainPageContent} from '../../hooks/api-hooks.js';
import Banner from '../../components/banner/Banner.jsx';
import Profile from '../../components/profile/Profile.jsx';
import YouTube from '../../components/youTube/YouTube.jsx';
import SocialMedia from '../../components/socialMedia/SocialMedia.jsx';
import Comments from '../../components/comments/Comments.jsx';
import {SECTIONS} from '../../constants.js';
import WhyUs from "../../components/whyUs/WhyUs.jsx";
import Planning from "../../components/planning/Planning.jsx";
import Tagline from "../../components/tagline/Tagline.jsx";
import Gallery from "../../components/gallery/Gallery.jsx";
import Footer from "../../components/footer/Footer.jsx";
import {Fade} from "react-awesome-reveal";

export const Home = () => {
    let banner, profile, socialMedia, youtube, comments, tagline, planning, gallery, footer, whyUs;

    const {
        data: mainPageContentResponse,
        isSuccess,
    } = useGetMainPageContent();

    const getSectionFromResponse = (searchSection) =>
        mainPageContentResponse?.data?.find(
            ({sectionName}) => sectionName === searchSection
        ) || {sectionName: searchSection, showSection: false};

    if (isSuccess) {
        banner = getSectionFromResponse(
            SECTIONS.BANNER);
        profile = getSectionFromResponse(
            SECTIONS.PROFILE);
        socialMedia = getSectionFromResponse(
            SECTIONS.SOCIAL_MEDIA);
        youtube = getSectionFromResponse(
            SECTIONS.YOUTUBE);
        comments = getSectionFromResponse(
            SECTIONS.COMMENTS);
        tagline = getSectionFromResponse(SECTIONS.TAGLINE);
        planning = getSectionFromResponse(SECTIONS.PLANNING);
        gallery = getSectionFromResponse(SECTIONS.GALLERY);
        footer = getSectionFromResponse(SECTIONS.FOOTER);
        whyUs = getSectionFromResponse(SECTIONS.WHY_US);
    }

    return (
        <div className="App">
            {
                isSuccess &&
                <div role="main" className="main">

                    {
                        banner.showSection &&
                            <Banner bannerResponseObj={banner}/>
                    }
                    {
                        profile.showSection &&
                        <Fade bottom distance="5%" duration={1000}>
                            <Profile profileResponseObj={profile}/>
                        </Fade>
                    }
                    {
                        whyUs.showSection &&
                        <Fade bottom distance="10%" duration={1000}>
                            <WhyUs responseObj={whyUs}/>
                        </Fade>
                    }
                    {
                        planning.showSection &&
                        <Fade bottom distance="10%" duration={1000}>
                            <Planning responseObj={planning}/>
                        </Fade>
                    }
                    {
                        tagline.showSection &&
                        <Fade bottom distance="10%" duration={1000}>
                            <Tagline responseObj={tagline}/>
                        </Fade>
                    }
                    {
                        gallery.showSection &&
                        <Fade bottom distance="10%" duration={1000}>
                            <Gallery responseObj={gallery}/></Fade>
                    }
                    {
                        youtube.showSection &&
                        <Fade bottom distance="10%" duration={1000}>
                            <YouTube YouTubeResponseObj={youtube}/>
                        </Fade>
                    }
                    {
                        socialMedia.showSection &&
                        <Fade bottom distance="10%" duration={1000}>
                            <SocialMedia
                                socialMediaResponseObj={socialMedia}/></Fade>
                    }
                    {
                        comments.showSection &&
                        <Fade bottom distance="10%" duration={1000}>
                            <Comments commentResponseObj={comments}/>
                        </Fade>
                    }
                    {
                        footer.showSection &&
                        <Fade bottom distance="10%" duration={1000}>
                            <Footer responseObj={{
                                footer: {...footer},
                                socialMedia: {...socialMedia}
                            }}/>
                        </Fade>
                    }

                </div>
            }
        </div>
    );
};