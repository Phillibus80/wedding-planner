import {Fade} from "react-awesome-reveal";
import {Image} from "react-bootstrap";

import Profile from '../../components/aboutUs/Profile.jsx';
import * as profileStyles from "../../components/aboutUs/Profile.module.scss";
import Banner from '../../components/banner/Banner.jsx';
import Comments from '../../components/comments/Comments.jsx';
import Footer from "../../components/footer/Footer.jsx";
import Gallery from "../../components/gallery/Gallery.jsx";
import Planning from "../../components/planning/Planning.jsx";
import * as planningStyles from "../../components/planning/Planning.module.scss";
import SocialMedia from '../../components/socialMedia/SocialMedia.jsx';
import Tagline from "../../components/tagline/Tagline.jsx";
import * as taglineStyles from "../../components/tagline/Tagline.module.scss";
import WhyUs from "../../components/whyUs/WhyUs.jsx";
import YouTube from '../../components/youTube/YouTube.jsx';
import {SECTIONS} from '../../constants.js';
import {useGetMainPageContent} from '../../hooks/api-hooks.js';

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
                            <div className={profileStyles.profile}>
                                <Image src={'../../../api/img/Decor_2.webp'}
                                       alt='background image'
                                       role='presentation'
                                       aria-hidden
                                       className={profileStyles.backgroundFlourish_1}
                                       loading='lazy'
                                       defer
                                />

                                <div className={profileStyles.backgroundFlourish_wrapper}>
                                    <Image src={'../../../api/img/Decor_2.webp'}
                                           alt='background image'
                                           role='presentation'
                                           aria-hidden
                                           className={profileStyles.backgroundFlourish_2}
                                           loading='lazy'
                                           defer
                                    />
                                </div>
                                <Profile profileResponseObj={profile}/>
                            </div>
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
                            <div className={planningStyles.planning}>
                                <Image src={'../../../api/img/Decor-outline.webp'}
                                       alt='background image'
                                       role='presentation'
                                       aria-hidden
                                       className={planningStyles.backgroundFlourish_1}
                                       loading="lazy"
                                       defer
                                />
                                <Image src={'../../../api/img/Decor-outline.webp'}
                                       alt='background image'
                                       role='presentation'
                                       aria-hidden
                                       className={planningStyles.backgroundFlourish_2}
                                       loading="lazy"
                                       defer
                                />

                                <Planning responseObj={planning}/>
                            </div>
                        </Fade>
                    }
                    {
                        tagline.showSection &&
                        <Fade bottom distance="10%" duration={1000}>
                            <div className={taglineStyles.tagline}>
                                <Image src={'../../../api/img/Decor.webp'}
                                       alt='background image'
                                       role='presentation'
                                       aria-hidden
                                       className={taglineStyles.backgroundFlourish_1}
                                       loading="lazy"
                                       defer
                                />
                                <Image src={'../../../api/img/Decor_2.webp'}
                                       alt='background image'
                                       role='presentation'
                                       aria-hidden
                                       className={taglineStyles.backgroundFlourish_2}
                                       loading="lazy"
                                       defer
                                />

                                <Tagline responseObj={tagline}/>
                            </div>
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