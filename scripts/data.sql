USE risen_rose_db;

DROP TABLE IF EXISTS USERS;
CREATE TABLE USERS
(
    ID               INT          NOT NULL AUTO_INCREMENT,
    F_NAME           VARCHAR(50)  NOT NULL,
    L_NAME           VARCHAR(50)  NOT NULL,
    USERNAME         VARCHAR(50)  NOT NULL,
    EMAIL            VARCHAR(100) NOT NULL,
    PASSWORD         VARCHAR(60)  NOT NULL,
    PERMISSION_LEVEL VARCHAR(50)  NOT NULL DEFAULT 'PUBLIC',
    created_on       DATETIME              DEFAULT CURRENT_TIMESTAMP,
    updated_on       DATETIME              DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (ID),
    UNIQUE (USERNAME, EMAIL)
);

DROP TABLE IF EXISTS PAGES;
CREATE TABLE PAGES
(
    PAGE_NAME        VARCHAR(20) NOT NULL,
    ROUTE_NAME       VARCHAR(20) NOT NULL,
    PERMISSION_LEVEL VARCHAR(50) NOT NULL DEFAULT 'PUBLIC',
    created_on       DATETIME             DEFAULT CURRENT_TIMESTAMP,
    updated_on       DATETIME             DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (PAGE_NAME),
    UNIQUE (PAGE_NAME, ROUTE_NAME)
);

DROP TABLE IF EXISTS SECTIONS;
CREATE TABLE SECTIONS
(
    SECTION_NAME     VARCHAR(50) NOT NULL,
    PAGE_NAME        VARCHAR(50) NOT NULL,
    SHOW_SECTION     boolean              DEFAULT 0,
    PERMISSION_LEVEL VARCHAR(50) NOT NULL DEFAULT 'PUBLIC',
    TITLE            VARCHAR(200),
    SUB_TITLE        VARCHAR(200),
    CONTENT          TEXT,
    created_on       DATETIME             DEFAULT CURRENT_TIMESTAMP,
    updated_on       DATETIME             DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (SECTION_NAME)
);

DROP TABLE IF EXISTS IMAGES;
CREATE TABLE IMAGES
(
    IMAGE_NAME       VARCHAR(50),
    SRC              VARCHAR(100),
    ALT              VARCHAR(100),
    TAGLINE          VARCHAR(200),
    SECTION_NAME     VARCHAR(50) NOT NULL,
    PERMISSION_LEVEL VARCHAR(50) NOT NULL DEFAULT 'PUBLIC',
    PRIORITY_NUMBER  INT         NOT NULL DEFAULT 1,
    created_on       DATETIME             DEFAULT CURRENT_TIMESTAMP,
    updated_on       DATETIME             DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (IMAGE_NAME),
    UNIQUE (SRC, IMAGE_NAME)
);

DROP TABLE IF EXISTS LINKS;
CREATE TABLE LINKS
(
    ID               INT          NOT NULL AUTO_INCREMENT,
    TITLE            VARCHAR(50)  NOT NULL,
    URL              VARCHAR(100) NOT NULL,
    SECTION_NAME     VARCHAR(50)  NOT NULL,
    PERMISSION_LEVEL VARCHAR(50)  NOT NULL DEFAULT 'PUBLIC',
    created_on       DATETIME              DEFAULT CURRENT_TIMESTAMP,
    updated_on       DATETIME              DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (ID),
    UNIQUE (TITLE, URL)
);

DROP TABLE IF EXISTS COMMENTS;
CREATE TABLE COMMENTS
(
    ID               INT           NOT NULL AUTO_INCREMENT,
    AUTHOR           VARCHAR(50)   NOT NULL,
    COMMENT          VARCHAR(1500) NOT NULL,
    SECTION_NAME     VARCHAR(50)   NOT NULL,
    PERMISSION_LEVEL VARCHAR(50)   NOT NULL DEFAULT 'PUBLIC',
    created_on       DATETIME               DEFAULT CURRENT_TIMESTAMP,
    updated_on       DATETIME               DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (ID)
);

DROP TABLE IF EXISTS WHY_US;
CREATE TABLE WHY_US
(
    ID               INT           NOT NULL AUTO_INCREMENT,
    TITLE            VARCHAR(50)   NOT NULL,
    WHY_TEXT         VARCHAR(2000) NOT NULL,
    SECTION_NAME     VARCHAR(50)   NOT NULL,
    MUI_ICON         VARCHAR(200),
    ICONIFY_ICON     VARCHAR(200),
    PERMISSION_LEVEL VARCHAR(50)   NOT NULL DEFAULT 'PUBLIC',
    created_on       DATETIME               DEFAULT CURRENT_TIMESTAMP,
    updated_on       DATETIME               DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (ID)
);

DROP TABLE IF EXISTS PLANNING;
CREATE TABLE PLANNING
(
    ID               INT           NOT NULL AUTO_INCREMENT,
    COLUMN_TITLE     VARCHAR(50)   NOT NULL,
    TITLE            VARCHAR(50)   NOT NULL,
    PLANNING_TEXT    VARCHAR(2000) NOT NULL,
    SECTION_NAME     VARCHAR(50)   NOT NULL,
    PERMISSION_LEVEL VARCHAR(50)   NOT NULL DEFAULT 'PUBLIC',
    created_on       DATETIME               DEFAULT CURRENT_TIMESTAMP,
    updated_on       DATETIME               DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (ID)
);

DROP TABLE IF EXISTS QUESTIONS;
CREATE TABLE QUESTIONS
(
    ID               INT           NOT NULL AUTO_INCREMENT,
    QUESTION_SECTION VARCHAR(250)  NOT NULL,
    QUESTION_NAME    VARCHAR(250)  NOT NULL,
    QUESTION_TEXT    VARCHAR(1500) NOT NULL,
    QUESTION_TYPE    VARCHAR(10)   NOT NULL,
    QUESTION_OPTIONS VARCHAR(2000)          DEFAULT '',
    REQUIRED         BOOLEAN                DEFAULT FALSE,
    PAGE_NAME        VARCHAR(150)  NOT NULL,
    SECTION_ORDER    INT           NOT NULL DEFAULT 1,
    PERMISSION_LEVEL VARCHAR(10)   NOT NULL DEFAULT 'PUBLIC',
    created_on       DATETIME               DEFAULT CURRENT_TIMESTAMP,
    updated_on       DATETIME               DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (ID),
    UNIQUE (QUESTION_NAME, QUESTION_SECTION, PAGE_NAME)
);

INSERT INTO USERS (ID,
                   F_NAME,
                   L_NAME,
                   USERNAME,
                   EMAIL,
                   PASSWORD,
                   PERMISSION_LEVEL)
VALUES (1,
        'Arnold',
        'Schwarzenegger',
        'theTerminator',
        'iwillbeback@judgement.day',
        'itsnotatumor',
        'SUPER');

INSERT INTO PAGES (PAGE_NAME, ROUTE_NAME, PERMISSION_LEVEL)
VALUES ('main', '/', 'PUBLIC'),
       ('dest_wed_q', '/destin-question', 'PUBLIC'),
       ('wedding_q', '/wedding-question', 'PUBLIC'),
       ('admin', '/admin', 'PRIVATE'),
       ('login', '/login', 'PUBLIC');

INSERT INTO SECTIONS (SECTION_NAME, PAGE_NAME, SHOW_SECTION, PERMISSION_LEVEL)
VALUES ('banner',
        'main',
        true,
        'PUBLIC');

INSERT INTO SECTIONS (SECTION_NAME, PAGE_NAME, SHOW_SECTION, PERMISSION_LEVEL, TITLE, SUB_TITLE, CONTENT)
VALUES ('profile',
        'main',
        true,
        'PUBLIC',
        'about Us',
        'Discover our story',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut id aliquet dolor. Nullam sed dui id tortor pretium dictum quis nec massa. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Duis eget ex efficitur, dignissim nibh quis, ultricies tortor. Curabitur in quam sed sem accumsan ullamcorper. Suspendisse dignissim, eros eget pretium aliquet, purus sem congue metus, eu tristique metus leo vel ipsum. Morbi posuere orci lorem, sed aliquet lectus varius ac. Aenean ac imperdiet nisi. Cras cursus facilisis tellus. Duis scelerisque semper molestie. Ut eu dignissim arcu, quis ultrices mi. Phasellus ornare faucibus est, a lobortis dui volutpat at. Aliquam id justo sit amet orci euismod hendrerit. Pellentesque eleifend risus est, sed molestie diam ultrices in. Proin mattis, justo quis placerat consectetur, dolor mi cursus magna, in eleifend dui nibh aliquet augue. Mauris dapibus aliquam aliquet.

Sed pellentesque mollis metus, sit amet scelerisque urna accumsan in. Morbi hendrerit lacinia vehicula. Donec rutrum diam ac libero eleifend accumsan. In cursus tortor eget urna luctus accumsan. Cras consectetur condimentum turpis a pulvinar. Sed eget diam egestas, aliquam magna vel, egestas ante. Duis a elementum nisl. Maecenas cursus arcu neque, at viverra justo dictum sit amet. Aliquam scelerisque, turpis sit amet laoreet efficitur, nibh est accumsan lorem, ac vestibulum odio dui a neque. Pellentesque sollicitudin leo ac lacus auctor, id pulvinar ante congue. Aliquam a enim tincidunt, scelerisque metus consequat, semper enim. Proin convallis turpis tortor, nec hendrerit justo aliquam eu. Donec id justo sapien. Proin magna lectus, gravida eu porta id, rutrum nec odio. Ut fermentum lorem eu leo sollicitudin hendrerit. Donec mauris mi, suscipit sed ligula non, eleifend semper velit.

Maecenas accumsan cursus rhoncus. Donec eu ante nec justo auctor vehicula. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Vestibulum sit amet nisl ex. Vestibulum porta nec nisl et venenatis. Vivamus sed condimentum arcu. Nullam volutpat ligula ipsum, a vehicula sem pulvinar in. In quis diam mattis justo viverra iaculis. Etiam finibus porttitor sem a tincidunt. Sed condimentum pharetra nisi, pellentesque convallis elit laoreet sit amet.');

INSERT INTO SECTIONS (SECTION_NAME, PAGE_NAME, SHOW_SECTION, TITLE, SUB_TITLE, PERMISSION_LEVEL)
VALUES ('why-us',
        'main',
        true,
        'Why Us',
        'Discover why',
        'PUBLIC'),
       ('planning',
        'main',
        true,
        'Let Us Plan Your Special Day',
        'for all your wedding needs',
        'PUBLIC'),
       ('gallery',
        'main',
        true,
        'Gallery',
        'Tell me that your love is sure thing',
        'PUBLIC');

INSERT INTO SECTIONS (SECTION_NAME, PAGE_NAME, SHOW_SECTION, TITLE, PERMISSION_LEVEL)
VALUES ('comments',
        'main',
        true,
        'What people are saying about Risen Rose',
        'PUBLIC'),
       ('tagline',
        'main',
        true,
        'Celebrating love and luxury, elevate your event with Risen Rose Creations',
        'PUBLIC'),
       ('footer',
        'main',
        true,
        '',
        'PUBLIC'),
       ('social-media',
        'main',
        false,
        'Follow Us',
        'PUBLIC');

INSERT INTO COMMENTS (author, comment, section_name)
VALUES ('Michelle P.',
        'They must be doing something right.',
        'comments'),
       ('Diane C.',
        'They must be doing something right..',
        'comments'),
       ('Deanna E.',
        'They must be doing something right.',
        'comments');

INSERT INTO WHY_US (TITLE, MUI_ICON, ICONIFY_ICON, WHY_TEXT, SECTION_NAME)
VALUES ('Wedding Tagline',
        'Celebration',
        '',
        'Blah Blah Blah Blah Blah Blah',
        'why-us'),
       ('International Destination',
        'AirplanemodeActive',
        '',
        'They must be doing something right.  But this time internationally.',
        'why-us'),
       ('International Destination Questionnaire',
        'BeachAccess',
        '',
        'They must be doing something right.  Blah Blah Blah Blah Blah Blah',
        'why-us'),
       ('Wedding Questionnaire',
        '',
        'mdi:ring',
        'Blah Blah Blah Blah Blah Blah .They must be doing something right.',
        'why-us');

INSERT INTO PLANNING (COLUMN_TITLE, TITLE, PLANNING_TEXT, SECTION_NAME)
VALUES ('01',
        'Questionnaires',
        'Blah Blah Blah Blah Blah Blah.',
        'planning'),
       ('02',
        'Wedding Planning',
        'Some stuff goes here and some stuff goes there.',
        'planning'),
       ('03',
        'International Wedding',
        'Jet setting and pet petting.',
        'planning');

INSERT INTO IMAGES (IMAGE_NAME, SRC, ALT, TAGLINE, SECTION_NAME, PRIORITY_NUMBER)
VALUES ('image1', '/img/page-img/image1.jpg', 'banner image', '', 'banner', 1);

INSERT INTO IMAGES (IMAGE_NAME, SRC, ALT, TAGLINE, SECTION_NAME)
VALUES ('profile', '/img/page-img/riseRose1.jpg', 'picture of Allison Lozano', '', 'profile'),
       ('gallery1', '/img/page-img/riseRose1.jpg', 'gallery image', '', 'gallery'),
       ('gallery2', '/img/page-img/riseRose2.jpg', 'gallery image', '', 'gallery'),
       ('gallery3', '/img/page-img/riseRose3.jpg', 'gallery image', '', 'gallery'),
       ('gallery4', '/img/page-img/riseRose4.jpg', 'gallery image', '', 'gallery'),
       ('gallery5', '/img/page-img/riseRose5.jpg', 'gallery image', '', 'gallery'),
       ('gallery6', '/img/page-img/riseRose6.jpg', 'gallery image', '', 'gallery'),
       ('gallery7', '/img/page-img/riseRose7.jpg', 'gallery image', '', 'gallery'),
       ('gallery8', '/img/page-img/riseRose8.jpg', 'gallery image', '', 'gallery'),
       ('gallery9', '/img/page-img/riseRose9.jpg', 'gallery image', '', 'gallery'),
       ('gallery10', '/img/page-img/riseRose10.jpg', 'gallery image', '', 'gallery'),
       ('logo', '/img/page-img/Logo.png', 'risen rose logo', '', 'footer'),
       ('facebook-logo', '/img/page-img/faceBookLogo.png', 'facebook logo', '', 'social-media'),
       ('yelp-logo', '/img/page-img/yelpLogo.png', 'yelp logo', '', 'social-media'),
       ('planning-column-1', '/img/page-img/riseRose3.jpg', 'questionnaire image', '', 'planning'),
       ('planning-column-2', '/img/page-img/riseRose5.jpg', 'wedding planning image', '', 'planning'),
       ('planning-column-3', '/img/page-img/riseRose7.jpg', 'international wedding image', '', 'planning');

INSERT INTO LINKS (TITLE, URL, SECTION_NAME)
VALUES ('Facebook', 'https://www.facebook.com', 'social-media'),
       ('Yelp', 'https://www.yelp.com', 'social-media');


INSERT INTO QUESTIONS (QUESTION_SECTION, QUESTION_NAME, QUESTION_TEXT, QUESTION_TYPE, QUESTION_OPTIONS, PAGE_NAME,
                       PERMISSION_LEVEL, REQUIRED, SECTION_ORDER)
VALUES
    -- Wedding Questionnaire
    -- Personal Information
    ('Personal Information', 'coupleName', 'Names of the couple:', 'input', '', 'wedding_questions', 'public', true, 1),
    ('Personal Information', 'address', 'Address:', 'input', '', 'wedding_questions', 'public', true, 1),
    ('Personal Information', 'phoneNumber', 'Phone Number:', 'tel', '', 'wedding_questions', 'public', true, 1),
    ('Personal Information', 'email', 'Email:', 'email', '', 'wedding_questions', 'public', true, 1),
    ('Personal Information', 'weddingDate', 'When is your wedding date?', 'date', '', 'wedding_questions', 'public',
     true, 1),
    ('Personal Information', 'preferredWeddingTime', 'What is your preferred time for your wedding?', 'time', '',
     'wedding_questions', 'public', true, 1),

    -- Background And Story
    ('Background and Story', 'howMeet', 'How did you meet?', 'textarea', '', 'wedding_questions', 'public', true, 2),
    ('Background and Story', 'engagementStory', 'What is your engagement story?', 'textarea', '', 'wedding_questions',
     'public', true, 2),
    ('Background and Story', 'favMemories', 'What are your favorite memories as a couple?', 'textarea', '',
     'wedding_questions',
     'public', true, 2),
    ('Background and Story', 'hobbies', 'What are your individual and shared interests and hobbies?', 'textarea', '',
     'wedding_questions', 'public', true, 2),
    ('Background and Story', 'favMusic', 'What are your favorite music genres?', 'textarea', '', 'wedding_questions',
     'public', true, 2),

    -- Wedding Vision
    ('Wedding Vision', 'dreamWedding', 'Describe your dream wedding in a few words.', 'textarea', '',
     'wedding_questions',
     'public', true, 3),
    ('Wedding Vision', 'weddingEmotions', 'What emotions do you want your wedding to evoke?', 'textarea', '',
     'wedding_questions', 'public', true, 3),
    ('Wedding Vision', 'weddingStyle', 'What style or theme do you envision for your wedding?', 'select',
     'modern,classic,vintage,non-conventional', 'wedding_questions', 'public', true, 3),
    ('Wedding Vision', 'weddingVision',
     'Are there any special wedding trends or unique things you would like to include at any point of the day?',
     'textarea', '', 'wedding_questions', 'public', true, 3),

    -- Guest Information
    ('Guest Information', 'expectedGuests', 'What is the number of expected guests?', 'number', '', 'wedding_questions',
     'public', true, 4),
    ('Guest Information', 'vips',
     'Will there be any special guests or VIPs (e.g., family, friends, celebrities) attending?',
     'select', 'true,false', 'wedding_questions', 'public', true, 4),
    ('Guest Information', 'inTown', 'How many guests will be from in-town?', 'number', '', 'wedding_questions',
     'public', true, 4),
    ('Guest Information', 'outTown', 'How many guests will be from out-of-town?', 'number', '', 'wedding_questions',
     'public', true, 4),

    -- Venue and Location
    ('Venue and Location', 'venueCity', 'What is your desired wedding location/city?', 'input', '', 'wedding_questions',
     'public', true, 5),
    ('Venue and Location', 'venueCounty', 'What county is that in?', 'input', '', 'wedding_questions', 'public', true,
     5),
    ('Venue and Location', 'venueIndoorsOutdoors', 'Will your wedding be indoors or outdoors?', 'input', '',
     'wedding_questions', 'public', true, 5),
    ('Venue and Location', 'venueType', 'What is your preferred venue type?', 'select',
     'church,hotel,beach,castle,vineyard,country,other', 'wedding_questions', 'public', true, 5),
    ('Venue and Location', 'venueLocation',
     'If you have a specific venue(s) in mind, please list them in order from most preferred to least preferred.',
     'textarea', '', 'wedding_questions', 'public', true, 5),

    -- Budget
    ('Budget', 'budget', 'What is your approximate wedding budget?', 'number', '', 'wedding_questions', 'public', true,
     6),
    ('Budget', 'budgetPaid', 'How will the wedding be paid for?', 'textarea', '', 'wedding_questions', 'public', true,
     6),
    ('Budget', 'budgetPriority', 'Are there any specific areas where you prioritize spending?', 'textarea', '',
     'wedding_questions', 'public', true, 6),

    -- Wedding Party
    ('Wedding Party', 'partyBridesmaids', 'Bridesmaids:', 'textarea', '', 'wedding_questions', 'public', true, 7),
    ('Wedding Party', 'partyBridesmaidsRole', 'What will the bridesmaids\' role be?', 'textarea', '',
     'wedding_questions',
     'public', true, 7),
    ('Wedding Party', 'groomsmen', 'Groomsmen:', 'textarea', '', 'wedding_questions', 'public', true, 7),
    ('Wedding Party', 'groomsmenRole', 'What will the groomsmen\'s role be?', 'textarea', '', 'wedding_questions',
     'public', true, 7),
    ('Wedding Party', 'maidOfHonor', 'Maid of honor:', 'textarea', '', 'wedding_questions', 'public', true, 7),
    ('Wedding Party', 'maidOfHonorRole', 'What is the role of the maid of honor?', 'textarea', '', 'wedding_questions',
     'public', true, 7),
    ('Wedding Party', 'bestMan', 'Who will be the best man?', 'textarea', '', 'wedding_questions', 'public', true, 7),
    ('Wedding Party', 'bestManRole', 'What is the role of the best man?', 'textarea', '', 'wedding_questions',
     'public', true, 7),

    -- Design and Decor
    ('Design and Decor', 'designAndDecorPalette', 'Color palette preferences?', 'textarea', '', 'wedding_questions',
     'public', true, 8),
    ('Design and Decor', 'designAndDecorFloral', 'Preferred floral arrangements and styles:', 'textarea', '',
     'wedding_questions', 'public', true, 8),
    ('Design and Decor', 'designAndDecorLighting', 'Lighting preferences?', 'textarea', '', 'wedding_questions',
     'public', true, 8),

    -- Ceremony
    ('Ceremony', 'ceremonyType', 'Type of ceremony (religious, non-religious, cultural)?', 'textarea', '',
     'wedding_questions',
     'public', true, 9),
    ('Ceremony', 'ceremonyPreferredMusic',
     'Are there any musical preferences you have for the ceremony? (piano, orchestra, specific songs, etc.)?',
     'textarea', '', 'wedding_questions', 'public', true, 9),
    ('Ceremony', 'ceremonyOfficiant', 'Do you have an officiant in mind? (family member, friend, priest, etc.)?',
     'textarea', '', 'wedding_questions', 'public', true, 9),
    ('Ceremony', 'ceremonyIndoorOutdoors', 'Will the ceremony be indoors or outdoors?', 'textarea', '',
     'wedding_questions',
     'public', true, 9),
    ('Ceremony', 'ceremonySunset', 'If outdoors, do you want to be married at sunset?', 'textarea', '',
     'wedding_questions',
     'public', true, 9),
    ('Ceremony', 'ceremonyCustoms', 'Any special customs or rituals you want to include?', 'textarea', '',
     'wedding_questions',
     'public', true, 9),

    -- Reception
    ('Reception', 'receptionPreferredStyle',
     'Do you have a preferred reception style (e.g., sit-down dinner, cocktail reception)?', 'textarea',
     '', 'wedding_questions', 'public', true, 10),
    ('Reception', 'receptionPreferredEntertainment',
     'Do you have entertainment preferences (live band, DJ, dancers, etc.)?', 'textarea', '',
     'wedding_questions', 'public', true, 10),
    ('Reception', 'receptionSpecificSongs',
     'Do you have specific songs in mind for wedding party entrance, couple’s first dance, mother-son/father-daughter dance, etc.?',
     'textarea', '', 'wedding_questions', 'public', true, 10),

    -- Food and Beverage
    ('Food and Beverage', 'dietaryRestrictions', 'Will there be any dietary preferences or restrictions?', 'textarea',
     '', 'wedding_questions',
     'public', true, 11),
    ('Food and Beverage', 'preferredCuisine', 'Any preferred cuisine or menu ideas?', 'textarea', '',
     'wedding_questions',
     'public', true, 11),
    ('Food and Beverage', 'alcohol', 'Will alcohol be served?', 'radio', 'yes, no', 'wedding_questions', 'public', true,
     11),

    -- Wedding Cake
    ('Wedding Cake', 'cakeRestrictions', 'Are there any dietary preferences or restrictions?', 'textarea', '',
     'wedding_questions', 'public', true, 12),
    ('Wedding Cake', 'cakeFlavors', 'What are your preferred style of cake, flavors, etc. ?', 'textarea', '',
     'wedding_questions', 'public', true, 12),
    ('Wedding Cake', 'cakeAlternatives',
     'Do you want to include an alternative to a wedding cake? (cupcakes, macaroons, dessert bar, etc.)?',
     'textarea', '', 'wedding_questions', 'public', true, 12),

    -- Photography and Videography
    ('Photography and Videography', 'photographyImportance',
     'What is the level of importance of capturing specific moments and locations?',
     'textarea', '', 'wedding_questions', 'public', true, 13),
    ('Photography and Videography', 'photographyStyle',
     'Do you have a preferred wedding photography style? (traditional, editorial, vintage, etc.)?', 'textarea', '',
     'wedding_questions', 'public', true, 13),
    ('Photography and Videography', 'photographyVideo', 'Will you hire both a photographer and videographer?', 'radio',
     'photographer,videographer,Both', 'wedding_questions', 'public', true, 13),
    ('Photography and Videography', 'photographyMoreImportant', 'Which one is more important?', 'textarea', '',
     'wedding_questions', 'public', true, 13),
    ('Photography and Videography', 'photographySpecialShots', 'Any must-have shots or special requests?', 'textarea',
     '', 'wedding_questions', 'public', true, 13),

    -- Attire and Beauty
    ('Attire and Beauty', 'attireAndBeautyDressStyle', 'Any wedding dress style preferences?', 'textarea', '',
     'wedding_questions', 'public', true, 14),
    ('Attire and Beauty', 'attireAndBeautyPreferredDesigner', 'What is your preferred designer?', 'input', '',
     'wedding_questions', 'public', true, 14),
    ('Attire and Beauty', 'attireAndBeautyGroomAttire', 'Any preference for the groom\'s attire?', 'textarea', '',
     'wedding_questions', 'public', true, 14),
    ('Attire and Beauty', 'attireAndBeautyPreferredMakeup', 'Any hair and makeup preference?', 'textarea', '',
     'wedding_questions', 'public', true, 14),

    -- Transportation
    ('Transportation', 'transportationPreferences',
     'Do you have specific transportation preferences for the wedding day?', 'textarea', '',
     'wedding_questions', 'public', true, 15),
    ('Transportation', 'transportationPreferredMode',
     'Preferred mode of transportation (e.g., limousine, vintage car, etc.)?', 'textarea', '',
     'wedding_questions', 'public', true, 15),
    ('Transportation', 'transportationToAndFrom',
     'How many guests will require transportation to/from the wedding venue?', 'number', '',
     'wedding_questions', 'public', true, 15),

    -- Accommodation
    ('Accommodation', 'accommodationOutOfTown', 'Any preferred accommodation for the couple and out-of-town guests?',
     'textarea', '',
     'wedding_questions', 'public', true, 16),

    -- Wedding Timeline
    ('Wedding Timeline', 'weddingTimelinePreferredStart', 'What is the desired start time for the wedding?', 'time', '',
     'wedding_questions', 'public', true, 17),
    ('Wedding Timeline', 'weddingTimelinePreferredEnd', 'What is the desired end time for the wedding?', 'time', '',
     'wedding_questions', 'public', true, 17),
    ('Wedding Timeline', 'weddingTimelineSunset',
     'Is there a specific point of the day that you want to happen at sunset?', 'textarea',
     '', 'wedding_questions', 'public', true, 17),
    ('Wedding Timeline', 'weddingTimelineEvents',
     'Any specific events or activities you want to include (e.g., welcome party, post-wedding brunch)?', 'textarea',
     '', 'wedding_questions', 'public', true, 17),

    -- Additional Requests or Notes
    ('Additional Requests or Notes', 'notesImportance',
     'What aspect(s) of the day are most important to you? If multiple, list them from most important to least important.',
     'textarea', '', 'wedding_questions', 'public', true, 18),
    ('Additional Requests or Notes', 'notesInformation',
     'Any other specific requests or information you want to share?', 'textarea',
     '', 'wedding_questions', 'public', true, 18),

    -- Destination Wedding Questionnaire
    -- Personal Information
    ('Personal Information', 'coupleName', 'Names of the couple:', 'input', '', 'destination_wedding_questions',
     'public', true, 1),
    ('Personal Information', 'address', 'Address:', 'input', '', 'destination_wedding_questions', 'public', true, 1),
    ('Personal Information', 'phoneNumber', 'Phone Number:', 'tel', '', 'destination_wedding_questions', 'public', true,
     1),
    ('Personal Information', 'email', 'Email:', 'email', '', 'destination_wedding_questions', 'public', true, 1),
    ('Personal Information', 'weddingDate', 'When is your wedding date?', 'date', '', 'destination_wedding_questions',
     'public', true, 1),
    ('Personal Information', 'preferredCommunication', 'What\'s your preferred method of communication?', 'select',
     'email,phone,text,video call', 'destination_wedding_questions', 'public', true, 1),

    -- Wedding Vision
    ('Wedding Vision', 'dreamWedding', 'Describe your dream destination wedding in a few words.', 'textarea', '',
     'destination_wedding_questions', 'public', true, 2),
    ('Wedding Vision', 'weddingEmotions', 'What emotions do you want your wedding to evoke?', 'textarea', '',
     'destination_wedding_questions', 'public', true, 2),
    ('Wedding Vision', 'destinationInterest', 'What drew you to the idea of a destination wedding?', 'textarea', '',
     'destination_wedding_questions', 'public', true, 2),

    -- Destination Preferences
    ('Destination Preferences', 'desiredCountry', 'What is your desired wedding country / city / region?', 'input',
     '', 'destination_wedding_questions', 'public', true, 3),
    ('Destination Preferences', 'alreadySelected',
     'Have you already selected a specific destination, or do you need suggestions?', 'input', '',
     'destination_wedding_questions', 'public', true, 3),

    -- Wedding Style and Theme
    ('Wedding Style and Theme', 'weddingTheme',
     'Describe your preferred wedding style (e.g. romantic, tropical, elegant, beachy).', 'textarea', '',
     'destination_wedding_questions', 'public', true, 4),
    ('Wedding Style and Theme', 'specialRequests', 'Any specific theme or cultural elements you want to incorporate?',
     'textarea', '', 'destination_wedding_questions', 'public', true, 4),

    -- Guest Information
    ('Guest Information', 'numGuest', 'What is the estimated number of guests attending the destination wedding?',
     'number', '', 'destination_wedding_questions', 'public', true, 5),
    ('Guest Information', 'vips',
     'Will there be any special guests or VIPs (e.g., family, friends, celebrities) attending?', 'select',
     'yes,no', 'destination_wedding_questions', 'public', true, 5),

    -- Budget
    ('Budget', 'approxBudget', 'What is your approximate budget for the destination wedding?', 'number', '',
     'destination_wedding_questions', 'public', true, 6),
    ('Budget', 'prioritySpending', 'Are there any specific areas where you prioritize spending?', 'textarea', '',
     'destination_wedding_questions', 'public', true, 6),

    -- Travel and Accommodation
    ('Travel and Accommodation', 'transportationDates',
     'What are the preferred travel dates for the couple and guests?', 'textarea', '',
     'destination_wedding_questions', 'public', true, 7),
    ('Travel and Accommodation', 'transportationRequirements',
     'Will you require assistance with travel arrangements for guests?', 'textarea', '',
     'destination_wedding_questions', 'public', true, 7),
    ('Travel and Accommodation', 'preferredAccommodations',
     'Any preferred accommodation for the couple and out-of-town guests?', 'textarea', '',
     'destination_wedding_questions', 'public', true, 7),

    -- Wedding Ceremony
    ('Wedding Ceremony', 'ceremonyType', 'Type of ceremony (religious, non-religious, cultural)?', 'textarea', '',
     'destination_wedding_questions', 'public', true, 8),
    ('Wedding Ceremony', 'customs', 'Any special customs or rituals you want to include?', 'textarea', '',
     'destination_wedding_questions', 'public', true, 8),

    -- Reception
    ('Reception', 'preferredReception',
     'Do you have a preferred reception style (e.g., sit-down dinner, cocktail reception)?', 'textarea', '',
     'destination_wedding_questions', 'public', true, 9),
    ('Reception', 'preferredEntertainment', 'Do you have entertainment preferences (live band, DJ, dancers, etc.)?',
     'textarea', '', 'destination_wedding_questions', 'public', true, 9),

    -- Design and Decor
    ('Design and Decor', 'colorPalette', 'Color palette preferences?', 'textarea', '',
     'destination_wedding_questions', 'public', true, 10),
    ('Design and Decor', 'preferredFloral', 'Preferred floral arrangements and styles that complement the destination:',
     'textarea', '', 'destination_wedding_questions', 'public', true, 10),

    -- Photography and Videography
    ('Photography and Videography', 'specificMoments',
     'What is the level of importance of capturing specific moments and locations?', 'textarea', '',
     'destination_wedding_questions', 'public', true, 11),
    ('Photography and Videography', 'photographyStyle',
     'Do you have a preferred wedding photography style? (traditional, editorial, vintage, etc.)?', 'textarea', '',
     'destination_wedding_questions', 'public', true, 11),
    ('Photography and Videography', 'videoPhoto', 'Will you hire both a photographer and videographer?', 'radio',
     'photographer,videographer,Both', 'destination_wedding_questions', 'public', true, 11),
    ('Photography and Videography', 'videoPhotoImportant', 'Which one is more important?', 'textarea', '',
     'destination_wedding_questions', 'public', true, 11),
    ('Photography and Videography', 'specialShotsList', 'Any must-have shots or special requests?', 'textarea', '',
     'destination_wedding_questions', 'public', true, 11),

    -- Food and Beverage
    ('Food and Beverage', 'restrictionList', 'Will there be any dietary preferences or restrictions?', 'textarea', '',
     'destination_wedding_questions', 'public', true, 12),
    ('Food and Beverage', 'preferredCuisine', 'Any specific cuisine or local dishes you want to incorporate?',
     'textarea', '', 'destination_wedding_questions', 'public', true, 12),

    -- Pre-Wedding and Post-Wedding Activities
    ('Pre-Wedding and Post-Wedding Activities', 'prewedding',
     'Are there any pre-wedding events or excursions you want to organize for guests?', 'textarea', '',
     'destination_wedding_questions', 'public', true, 13),
    ('Pre-Wedding and Post-Wedding Activities', 'postwedding',
     'Are you planning a post-wedding brunch or other activities?', 'textarea', '', 'destination_wedding_questions',
     'public', true, 13),

    -- Wedding Party
    ('Wedding Party', 'bridesmaids', 'Bridesmaids:', 'textarea', '', 'destination_wedding_questions', 'public', true,
     14),
    ('Wedding Party', 'bridesmaidsRoles', 'What will the bridesmaids\' role be?', 'textarea', '',
     'destination_wedding_questions', 'public', true, 14),
    ('Wedding Party', 'groomsmen', 'Groomsmen:', 'textarea', '', 'destination_wedding_questions', 'public', true, 14),
    ('Wedding Party', 'groomsmenRoles', 'What will the groomsman\'s role be?', 'textarea', '',
     'destination_wedding_questions', 'public', true, 14),
    ('Wedding Party', 'maidOfHonor', 'Maid of honor:', 'textarea', '', 'destination_wedding_questions', 'public', true,
     14),
    ('Wedding Party', 'maidOfHonorRole', 'What is the role of the maid of honor?', 'textarea', '',
     'destination_wedding_questions', 'public', true, 14),
    ('Wedding Party', 'bestMan', 'Who will be the best man?', 'textarea', '', 'destination_wedding_questions',
     'public', true, 14),
    ('Wedding Party', 'bestManRole', 'What is the role of the best man?', 'textarea', '',
     'destination_wedding_questions', 'public', true, 14),

    -- Attire and Beauty
    ('Attire and Beauty', 'dressParty', 'Any wedding attire preferences for the wedding party?', 'textarea', '',
     'destination_wedding_questions', 'public', true, 15),
    ('Attire and Beauty', 'dressStyle', 'Any wedding dress style preferences?', 'textarea', '',
     'destination_wedding_questions', 'public', true, 15),
    ('Attire and Beauty', 'preferredDesigner', 'What is your preferred designer?', 'input', '',
     'destination_wedding_questions', 'public', true, 15),
    ('Attire and Beauty', 'preferredGroomAttire', 'Any preference for the groom\'s attire?', 'textarea', '',
     'destination_wedding_questions', 'public', true, 15),
    ('Attire and Beauty', 'preferredHairAndMakeup', 'Any hair and makeup preference?', 'textarea', '',
     'destination_wedding_questions', 'public', true, 15),

    -- Wedding Timeline
    ('Wedding Timeline', 'desiredStartTime', 'What is the desired start time for the wedding?', 'time', '',
     'destination_wedding_questions', 'public', true, 16),
    ('Wedding Timeline', 'desiredEndTime', 'What is the desired end time for the wedding?', 'time', '',
     'destination_wedding_questions', 'public', true, 16),
    ('Wedding Timeline', 'specialEventsList',
     'Any specific events or activities you want to include in the destination wedding itinerary?', 'textarea', '',
     'destination_wedding_questions', 'public', true, 16),

    -- Local Legal Requirements
    ('Local Legal Requirements', 'localLegal',
     'Are you familiar with the legal requirements for getting married in the chosen destination?', 'radio', 'Yes,No',
     'destination_wedding_questions', 'public', true, 17),

    -- Weather and Season Considerations
    ('Weather and Season Considerations', 'weather',
     'Are you planning your wedding during a specific season? If so, what are your weather preferences?', 'textarea',
     '', 'destination_wedding_questions', 'public', true, 18),

    -- Emergency Contacts
    ('Emergency Contacts', 'emergency',
     'Provide emergency contact information for both the couple and any designated guests.', 'textarea', '',
     'destination_wedding_questions', 'public', true, 19),

    -- Additional Requests or Notes
    ('Additional Requests or Notes', 'importantAspects',
     'What aspect(s) of the day are most important to you? If multiple, list them from most important to least important.',
     'textarea', '', 'destination_wedding_questions', 'public', true, 20),
    ('Additional Requests or Notes', 'otherRequests', 'Any other specific requests or information you want to share?',
     'textarea', '', 'destination_wedding_questions', 'public', true, 20);
;



