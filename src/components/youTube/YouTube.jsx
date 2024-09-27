import PropTypes from 'prop-types';


import styles from './YouTube.module.scss';

const YouTube = ( { YouTubeResponseObj } ) => {
    const {
        title: youtubeTitle,
        content: {
            textContent: youtubeText,
            links: {
                linkList: youtubeLinks
            }
        }
    } = YouTubeResponseObj;

    return (
        <div
            className={styles.youtube}>
            <iframe
                title={youtubeTitle}
                className={styles.youtube_video}
                src={youtubeLinks[ 0 ].url}
                role='presentation'
                aria-label={youtubeText}
            />
        </div>
    );
};

YouTube.propTypes = {
    YouTubeResponseObj: PropTypes.shape( {
        title: PropTypes.string,
        content: PropTypes.shape( {
            textContent: PropTypes.string,
            links: PropTypes.shape( {
                linkList: PropTypes.arrayOf(
                    PropTypes.shape( {
                        url: PropTypes.string
                    } ) )
            } )
        } )
    } )
};

export default YouTube;