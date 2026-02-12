
const janeDoeService = {
    id: 1,
    category: 'Digital Marketing',
    image: 'https://res.cloudinary.com/dxvkigop9/image/upload/v1762596014/task-img-01-13_bdx4r4.webp',
    gallery: [
        'https://res.cloudinary.com/dxvkigop9/image/upload/v1762596014/task-img-01-13_bdx4r4.webp',
        'https://res.cloudinary.com/dxvkigop9/image/upload/v1762930089/task-img-03_em6mdd.webp',
        'https://res.cloudinary.com/dxvkigop9/image/upload/v1762930084/task-img-02_mi5dd0.webp',
    ],
    title: 'WordPress Website Development',
    stats: {
        rating: 0,
        reviews: 0,
        sales: 0,
        views: 814,
    },
    description: "Need a professional WordPress website? Look no further! I offer expert WordPress Website Development services to create stunning, functional, and user-friendly websites that align perfectly with your business goals. With years of experience in WordPress development and a passion for crafting exceptional websites, I am committed to delivering results that exceed your expectations. Whether you need a personal blog, portfolio site, corporate website, or online store, I can bring your vision to life. Let's collaborate to create a powerful WordPress website that showcases your brand and drives results. Contact me today to discuss your project requirements!",
    serviceFeatures: [
        'Customize and configure WordPress themes to suit your brand identity and requirements.',
        'Develop responsive and mobile-friendly websites for optimal viewing across all devices.',
        'Integrate essential plugins and features to enhance website functionality and user experience.',
        'Implement SEO best practices to optimize your website for search engine visibility.',
        'Create custom layouts and designs using HTML, CSS, and JavaScript for unique and engaging web pages.',
        'Set up e-commerce functionality using WooCommerce for online stores and product showcases.',
        'Ensure website security with best-in-class practices and plugins to protect against threats.',
        'Provide training and documentation for managing and updating your WordPress website.',
        'Offer ongoing maintenance and support services to keep your website running smoothly.',
    ],
    additionalServices: [],
    tags: ['CSS', 'Development', 'HTML', 'JQuery', 'Theme', 'WordPress'],
    faq: [
        {
            question: 'How do I get started with a WordPress website?',
            answer: 'This FAQ covers the initial steps for starting a WordPress website, including domain registration, hosting selection, and theme installation.'
        },
        {
            question: 'What is the difference between a basic and premium WordPress website?',
            answer: 'The primary difference lies in the level of customization, features, and support. Basic packages are great for simple sites, while premium packages offer advanced functionality, e-commerce capabilities, and dedicated support for complex business needs.'
        },
        {
            question: 'Do you offer website maintenance services for websites not developed by you?',
            answer: 'Yes, I offer maintenance packages for existing WordPress websites, even if I did not build them. Services include updates, security checks, backups, and performance optimization. Please contact me for a custom quote.'
        }
    ],
    packages: {
        basic: { name: 'Basic', price: 300, delivery: 0, description: 'Includes a basic WordPress website with up to 5 pages and standard features.', features: ['Up to 5 Pages', 'Responsive Design', 'Standard Plugins'] },
        standard: { name: 'Standard', price: 700, delivery: 5, description: 'A complete multi-page website for small businesses with custom design.', features: ['Up to 10 Pages', 'Custom Design', 'Basic SEO Setup'] },
        premium: { name: 'Premium', price: 1500, delivery: 10, description: 'A full-featured e-commerce store or complex business website.', features: ['E-commerce Functionality', 'Advanced Customization', 'Premium Support'] },
    },
    rating: 0,
    reviews: 0,
    location: 'United States (US)',
    price: 300,
};

const yukiTanakaDalleService = {
    id: 8,
    category: 'Programming & Tech',
    title: 'DALL-E Art Generation',
    image: 'https://res.cloudinary.com/dxvkigop9/image/upload/v1763103811/task-img-02-4_au2jvb.webp',
    stats: { rating: 0, reviews: 0, sales: 0, views: 0 },
    rating: 0,
    reviews: 0,
    location: 'Japan',
    price: 400,
    packages: { basic: {}, standard: {}, premium: {} },
};

const yukiTanakaAiService = {
    id: 2,
    category: 'Programming & Tech',
    title: 'AI Solution Development',
    image: 'https://res.cloudinary.com/dxvkigop9/image/upload/v1762596027/task-img-03-5_ier1en.webp',
    gallery: [
        'https://res.cloudinary.com/dxvkigop9/image/upload/v1762941597/task-img-01-5_fpveqy.webp',
        'https://res.cloudinary.com/dxvkigop9/image/upload/v1762941603/task-img-02-5_pbt8bc.webp',
        'https://res.cloudinary.com/dxvkigop9/image/upload/v1762596027/task-img-03-5_ier1en.webp',
    ],
    stats: {
        rating: 5.0,
        reviews: 0,
        sales: 0,
        views: 1262,
    },
    description: "Transform your business with cutting-edge AI (Artificial Intelligence) Solution Development tailored to your needs. Whether you're seeking to enhance productivity, automate processes, or leverage data-driven insights, I offer specialized AI development services to drive innovation and growth.",
    serviceFeatures: [
        'Design and develop custom AI models and algorithms based on machine learning and deep learning techniques.',
        'Implement natural language processing (NLP) solutions for text analysis, sentiment analysis, and chatbot development.',
        'Build computer vision applications for image recognition, object detection, and video analytics.',
        'Develop predictive analytics and recommendation systems to optimize decision-making.',
        'Integrate AI solutions with existing systems and platforms to enhance functionality and intelligence.',
        'Train and fine-tune machine learning models using supervised, unsupervised, and reinforcement learning techniques.',
        'Deploy AI models on cloud platforms like AWS, Azure, or Google Cloud for scalable and efficient execution.',
        'Optimize AI solutions for performance, accuracy, and scalability.',
        'Provide consulting and strategy services to identify AI opportunities and roadmap implementation.',
        'Offer ongoing support, monitoring, and maintenance to ensure the continuous operation of AI systems.',
    ],
    additionalServices: [{
        title: 'Real-Time Updates',
        description: 'Implementing real-time data updates using WebSockets involves establishing a persistent connection between a client (such as a web browser) and a server, enabling bidirectional communication for instant data updates.',
        price: 250
    }],
    tags: ['AI Consulting', 'AI Development', 'AI Services', 'Computer Vision', 'Development', 'NLP', 'Plugin'],
    faq: [
        {
            question: 'What types of AI solutions do you develop?',
            answer: 'I develop a variety of AI solutions, including chatbots, recommendation systems, and predictive analytics applications. These solutions are tailored to meet the specific needs of businesses looking to automate or enhance existing processes, drive business growth, and improve operational efficiency.'
        },
        {
            question: 'How do chatbots enhance customer engagement?',
            answer: 'Chatbots enhance customer engagement by providing instant, 24/7 support and personalized interactions. They can answer frequently asked questions, guide users through processes, and collect valuable feedback, leading to improved customer satisfaction and loyalty.'
        },
        {
            question: 'What are recommendation systems and how do they work?',
            answer: 'Recommendation systems are algorithms that suggest relevant items to users, such as products, articles, or movies. They work by analyzing user data, such as past purchases and browsing history, to identify patterns and predict preferences. This helps businesses increase sales and improve user experience.'
        }
    ],
    packages: {
        basic: { name: 'Basic', price: 300, delivery: 4, description: 'Includes development of a basic web application with essential features.', features: ['Custom-Coded Pages', 'Source Level Mining', 'Inventory Management System(200)'] },
        standard: { name: 'Standard', price: 600, delivery: 7, description: 'Standard package with more features.', features: ['All in Basic', 'More pages', 'Admin Panel'] },
        premium: { name: 'Premium', price: 1200, delivery: 10, description: 'Premium package for enterprises.', features: ['All in Standard', 'E-commerce', 'Advanced analytics'] },
    },
    rating: 5.0,
    reviews: 0,
    location: 'Japan',
    price: 1200,
};

const emmaJohnsonService = {
    id: 3,
    category: 'Programming & Tech',
    image: 'https://res.cloudinary.com/dxvkigop9/image/upload/v1762596080/task-img-02-3_v1x8m4.webp',
    gallery: [
        'https://res.cloudinary.com/dxvkigop9/image/upload/v1762596034/task-img-02-3_unw3bb.webp',
        'https://res.cloudinary.com/dxvkigop9/image/upload/v1762930084/task-img-02_mi5dd0.webp',
        'https://res.cloudinary.com/dxvkigop9/image/upload/v1762596042/task-img-03-1_lza7bz.webp'
    ],
    title: 'Blockchain Solution Development',
    stats: {
        rating: 5.0,
        reviews: 1,
        sales: 1,
        views: 2501,
    },
    description: "This gig offers expert Blockchain Solution Development services tailored to your project needs. Whether you're looking to build a decentralized application (DApp), implement smart contracts, or integrate blockchain technology into your existing systems, I've got you covered. With years of experience in blockchain development and a passion for innovation, I am committed to delivering high-quality solutions that meet your requirements. Whether you're a startup exploring blockchain or an enterprise seeking to leverage distributed ledger technology, I'm here to assist you every step of the way. Let's bring your blockchain ideas to life and revolutionize your business with secure, transparent, and decentralized solutions. Contact me now to discuss your project!",
    serviceFeatures: [
        'Design and develop custom blockchain architectures and protocols.',
        'Create smart contracts on Ethereum, Binance Smart Chain, or other blockchain platforms.',
        'Build decentralized applications (DApps) using Solidity, Web3.js, and Truffle frameworks.',
        'Integrate blockchain solutions with web and mobile applications.',
        'Optimize and scale blockchain applications for performance and security.',
        'Conduct comprehensive testing and debugging to ensure robustness and reliability.',
        'Provide consultation on blockchain strategy and its applications.',
        'Offer technical support and maintenance post-deployment.',
        'Ensure compliance with industry standards and best practices.',
    ],
    additionalServices: [
        { title: 'Blockchain Consulting', description: 'Provides strategic advice and guidance on blockchain adoption, implementation, and integration into existing business processes.', price: 1000 },
        { title: 'Smart Contract Development', description: 'Develops and audits smart contracts using Solidity for Ethereum and Hyperledger Fabric platforms, ensuring security and reliability.', price: 2000 }
    ],
    tags: ['ai consulting', 'ai development', 'ai services', 'DAPP'],
    faq: [
        { question: 'What blockchain platforms do you specialize in?', answer: 'I specialize in Ethereum, Hyperledger Fabric, and other leading blockchain platforms.' },
        { question: 'Can you assist with tokenization and ICO/STO development?', answer: 'Yes, I provide end-to-end services for token creation, ICO/STO launches, and smart contract development to support your fundraising and tokenization needs.' },
        { question: 'Do you provide training and workshops on blockchain technology?', answer: 'Absolutely, I offer customized training sessions and workshops to help your team understand blockchain fundamentals, smart contracts, and DApp development.' }
    ],
    packages: {
        basic: { name: 'Starter', price: 100, delivery: 7, description: 'Ideal for businesses exploring blockchain technology.', features: ['Basic consultation', 'Simple smart contract (up to 100 lines)', 'Deployment assistance'] },
        standard: { name: 'Standard', price: 500, delivery: 14, description: 'A comprehensive solution for small to medium-sized projects.', features: ['All in Starter', 'DApp development (up to 3 pages)', 'Integration support'] },
        premium: { name: 'Premium', price: 1500, delivery: 21, description: 'An enterprise-grade solution for complex blockchain applications.', features: ['All in Standard', 'Full-scale DApp with admin panel', 'Ongoing maintenance (1 month)'] }
    },
    rating: 0,
    reviews: 0,
    location: 'United States (US)',
    price: 100,
};

const jamesNguyenAvatar = 'https://res.cloudinary.com/dxvkigop9/image/upload/v1763111332/8-1714133061-1714133061-100x100_zcx3fb.jpg';

const jamesTask1 = {
  id: 9,
  category: 'Design & Creative',
  image: 'https://res.cloudinary.com/dxvkigop9/image/upload/v1763110516/task-img-03-11_pmvenb.webp',
  title: 'Web Graphics and UI Design',
  rating: 0.0,
  reviews: 0,
  location: 'United States (US)',
  price: 250,
  seller: { name: 'James Nguyen', avatar: jamesNguyenAvatar, verified: true },
  packages: { basic: {}, standard: {}, premium: {} },
};

const jamesTask2 = {
  id: 10,
  category: 'Design & Creative',
  image: 'https://res.cloudinary.com/dxvkigop9/image/upload/v1762942516/task-img-03-12_fn5cme.webp',
  title: 'Logo Design and Branding',
  rating: 0.0,
  reviews: 0,
  location: 'United States (US)',
  price: 300,
  seller: { name: 'James Nguyen', avatar: jamesNguyenAvatar, verified: true },
  packages: { basic: {}, standard: {}, premium: {} },
};

const jackHenryAvatar = 'https://res.cloudinary.com/dxvkigop9/image/upload/v1763112011/11-1714142074-1714142074-50x50_flcvvc.jpg';

const jackHenryTask = {
    id: 5,
    category: 'Content Writing',
    image: 'https://res.cloudinary.com/dxvkigop9/image/upload/v1762596053/task-img-02-8_gqmc6y.webp',
    title: 'Compelling and Relevant Blog Content',
    rating: 0.0,
    reviews: 0,
    location: 'United States (US)',
    price: 80,
    seller: { name: 'Jack Henry', avatar: jackHenryAvatar, verified: true },
    packages: { basic: {}, standard: {}, premium: {} },
};

const alexMooreAvatar = 'https://res.cloudinary.com/dxvkigop9/image/upload/v1763112600/12-1714456400-1714456400-100x100_r8x3zz.jpg';

const alexMooreTask = {
    id: 6,
    category: 'Smart AI Services',
    image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070&auto=format&fit=crop',
    title: 'Custom WordPress Website Development',
    rating: 0.0,
    reviews: 0,
    location: 'Germany',
    price: 250,
    seller: { name: 'Alex Moore', avatar: alexMooreAvatar, verified: true },
    packages: { basic: {}, standard: {}, premium: {} },
};


export const services = [
    {
        ...janeDoeService,
        seller: {
            name: 'Jane Doe',
            avatar: 'https://res.cloudinary.com/dxvkigop9/image/upload/v1763111444/5-1714127904-1714127904-100x100_wgxdsx.jpg',
            verified: true,
            title: 'Experienced Web Developer',
            rating: 0,
            reviews: 0,
            views: 717,
            location: 'United States (US)',
            residenceType: 'Independent',
            languages: 'English',
            englishLevel: 'Fluent',
            about: "With more than 8 years of hands-on experience in web development, I bring a wealth of expertise in crafting responsive and user-friendly websites that leave a lasting impression. My deep understanding of web technologies fuels my passion for delivering high-quality work that exceeds expectations. Throughout my journey as a web developer, I have honed my skills in front-end and back-end technologies.",
            skills: ['AI Development', 'App Design', 'Plugin Development', 'Programming', 'Theme Development', 'Web Design'],
            education: [
                {
                    degree: 'Bachelor of Science in Computer Science',
                    institution: 'University of California, Berkeley',
                    dates: 'April 12, 2018 - April 27, 2018',
                    description: 'Completed a comprehensive program covering computer science fundamentals, algorithms, and data structures.'
                },
                {
                    degree: 'Web Development Bootcamp',
                    institution: 'Codecademy',
                    dates: 'April 19, 2018',
                    description: 'Intensive training in modern web development technologies, including HTML, CSS, JavaScript, and responsive design.'
                },
                {
                    degree: 'Advanced PHP Certification',
                    institution: 'Online Course',
                    dates: 'June 18, 2020',
                    description: 'Advanced training in PHP programming, covering topics such as object-oriented programming, database integration, and security best practices.'
                }
            ],
            tasks: [
                {
                    ...janeDoeService,
                    seller: { name: 'Jane Doe', avatar: 'https://res.cloudinary.com/dxvkigop9/image/upload/v1763111444/5-1714127904-1714127904-100x100_wgxdsx.jpg', verified: true }
                }
            ],
        },
    },
    {
        ...yukiTanakaAiService,
        seller: {
            name: 'Yuki Tanaka',
            avatar: 'https://res.cloudinary.com/dxvkigop9/image/upload/v1762940834/16-1714463451-1714463451-100x100_zf2j2o.jpg',
            verified: true,
            title: 'Professional AI Services Specialist',
            hourlyRate: 80,
            rating: 5.0,
            reviews: 1,
            views: 1517,
            location: 'Japan',
            residenceType: 'Independent',
            languages: 'English, Japanese',
            englishLevel: 'Conversational',
            about: "I'm delighted to introduce myself as Yuki Tanaka, an accomplished AI specialist deeply committed to harnessing the power of artificial intelligence (AI) to catalyze business transformation and drive innovation. With extensive experience in the field, my focus lies in crafting bespoke AI solutions that not only meet but exceed diverse client needs, delivering measurable and impactful results.",
            skills: ['AI Development', 'Art Generation', 'Artificial Intelligence', 'Midjourney', 'Programming', 'Machine Learning', 'Python'],
            education: [
                {
                    degree: 'Ph.D. in Artificial Intelligence',
                    institution: 'University of Tokyo',
                    dates: 'January 22, 2015 - October 31, 2019',
                    description: 'Completed an advanced research program specializing in machine learning algorithms, NLP, and computer vision applications.'
                },
                {
                    degree: 'AI Certification',
                    institution: 'Japan AI Institute',
                    dates: 'April 24, 2020',
                    description: 'Obtained specialized training in AI development, focusing on deep learning frameworks and neural network architectures.'
                }
            ],
            tasks: [
                { ...yukiTanakaDalleService, seller: { name: 'Yuki Tanaka', avatar: yukiTanakaDalleService.image, verified: true } },
                { ...yukiTanakaAiService, seller: { name: 'Yuki Tanaka', avatar: 'https://res.cloudinary.com/dxvkigop9/image/upload/v1762940834/16-1714463451-1714463451-100x100_zf2j2o.jpg', verified: true } },
            ],
        },
    },
    {
        ...emmaJohnsonService,
        seller: {
            name: 'Emma Johnson',
            avatar: 'https://res.cloudinary.com/dxvkigop9/image/upload/v1763105435/32-1714634885-1714634885-100x100_wq8lu8.jpg',
            verified: true,
            title: 'Blockchain Development Expert',
            hourlyRate: 80,
            rating: 5.0,
            reviews: 1,
            views: 2501,
            location: 'United States (US)',
            residenceType: 'Independent',
            languages: 'English, German',
            englishLevel: 'Fluent',
            about: "Hello! I'm Emma Johnson, an accomplished blockchain specialist dedicated to harnessing the power of decentralized technologies for innovation and tackling intricate challenges. With a strong passion for driving change through blockchain, I specialize in crafting tailored solutions that address a wide range of business requirements. My expertise lies in developing and implementing blockchain strategies that optimize processes, enhance security, and unlock new opportunities for businesses across various industries. I thrive on the dynamic nature of blockchain technology and its potential to revolutionize traditional practices. I look forward to collaborating and exploring how blockchain can pave the way for transformative solutions in our increasingly digital world.",
            skills: ['AI Development', 'Art Generation', 'Artificial Intelligence', 'Cinematography', 'Midjourney', 'DApp', 'Smart Contracts'],
            education: [
                {
                    degree: 'Bachelor of Science in Computer Science',
                    institution: 'Stanford University',
                    dates: 'November 7, 2014 - May 25, 2018',
                    description: 'Completed a comprehensive program covering computer science fundamentals and software development.'
                },
                {
                    degree: 'Blockchain Development Certification',
                    institution: 'Blockchain Academy',
                    dates: 'January 18, 2019',
                    description: 'Obtained specialized training in blockchain technology, including smart contract development and decentralized application (DApp) deployment.'
                }
            ],
            tasks: [
                {
                    ...emmaJohnsonService,
                    seller: { name: 'Emma Johnson', avatar: 'https://res.cloudinary.com/dxvkigop9/image/upload/v1763105435/32-1714634885-1714634885-100x100_wq8lu8.jpg', verified: true }
                }
            ],
        },
    },
    {
        id: 4,
        category: 'Digital Marketing',
        image: 'https://res.cloudinary.com/dxvkigop9/image/upload/v1762942516/task-img-03-12_fn5cme.webp',
        gallery: [
            'https://res.cloudinary.com/dxvkigop9/image/upload/v1762942515/task-img-01-12_loc9tz.webp',
            'https://res.cloudinary.com/dxvkigop9/image/upload/v1762942515/task-img-02-12_ahxah0.webp',
            'https://res.cloudinary.com/dxvkigop9/image/upload/v1762942516/task-img-03-12_fn5cme.webp'
        ],
        seller: {
            name: 'James Nguyen',
            avatar: jamesNguyenAvatar,
            verified: true,
            title: 'Creative Graphic Designer',
            hourlyRate: 70,
            rating: 0.0,
            reviews: 0,
            views: 908,
            location: 'United States (US)',
            residenceType: 'Agency',
            languages: 'English',
            englishLevel: 'Fluent',
            about: "As a passionate graphic designer, I am deeply committed to crafting compelling visual solutions that leave a lasting impact. My work is driven by a keen understanding of client objectives and a relentless pursuit of designs that resonate with target audiences. I create designs that not only meet the immediate needs of clients but also connect with viewers on a deeper level.",
            skills: ['App Design', 'Art Generation', 'Content Writing', 'Illustration', 'Logo Design', 'UI/UX', 'Branding'],
            education: [
                {
                    degree: 'Bachelor of Fine Arts in Graphic Design',
                    institution: 'School of Visual Arts (SVA)',
                    dates: 'July 25, 2015 - August 9, 2019',
                    description: 'Completed an intensive program focusing on graphic design principles, digital media, and visual communication.'
                },
                {
                    degree: 'Graphic Design Bootcamp',
                    institution: 'General Assembly',
                    dates: 'September 20, 2014',
                    description: 'Intensive training in industry-standard design software and techniques, including Adobe Creative Suite applications.'
                }
            ],
            tasks: [
                jamesTask1,
                jamesTask2
            ],
        },
        title: 'Logo design and unique brand Identity',
        stats: {
            rating: 0.0,
            reviews: 0,
            sales: 1,
            views: 908,
        },
        description: "I will create a professional and eye-catching logo design for your business or project. A logo is a crucial element of your brand identity, and I will work closely with you to ensure that the design reflects your brand values and resonates with your target audience. Whether you're starting a new business or rebranding an existing one, I can help you create a memorable and impactful logo that sets you apart from the competition. Let's work together to create a logo that truly represents your brand!",
        serviceFeatures: [
            'Researching your industry and competitors',
            'Creating initial concepts based on your brief',
            'Refining the chosen concept to perfection',
            'Delivering the final logo files in various formats (PNG, JPEG, SVG, etc.)',
        ],
        additionalServices: [],
        tags: ["AI Services", "CMS", "Design", "Management", "Marketing", "Theme", "WordPress"],
        faq: [
            {
                question: 'What is included in your logo design service?',
                answer: 'My service includes researching your industry and competitors, creating initial logo concepts, refining the chosen concept, and delivering the final logo files in various formats.'
            },
            {
                question: 'Can you incorporate specific elements or ideas into the logo?',
                answer: 'Yes, absolutely! I encourage you to share any specific ideas, concepts, or elements you have in mind. Your input is crucial for creating a logo that aligns with your vision.'
            },
            {
                question: 'What file formats will I receive for the final logo?',
                answer: 'You will receive the final logo in various standard formats, including PNG (transparent background), JPEG, and SVG (vector file), ensuring you have the right format for any application.'
            }
        ],
        packages: {
            basic: { name: 'Basic', price: 50, delivery: 3, description: 'A simple logo concept with 2 revisions.', features: ['1 Logo Concept', '2 Revisions', 'High-res PNG'] },
            standard: { name: 'Standard', price: 100, delivery: 5, description: 'Receive 3 initial logo concepts, providing you with more options.', features: ['3 Logo Concepts', 'Source File', 'Vector File'] },
            premium: { name: 'Premium', price: 250, delivery: 7, description: 'A complete branding package with logo, social media kit, and stationery.', features: ['5 Logo Concepts', 'Social Media Kit', 'Stationery Designs'] },
        },
        rating: 0.0,
        reviews: 0,
        location: 'United States (US)',
        price: 100,
    },
    {
        id: 5,
        category: 'Programming & Tech',
        image: 'https://res.cloudinary.com/dxvkigop9/image/upload/v1762596053/task-img-02-8_gqmc6y.webp',
        gallery: [
            'https://res.cloudinary.com/dxvkigop9/image/upload/v1762942862/task-img-01-8_oicggt.webp',
            'https://res.cloudinary.com/dxvkigop9/image/upload/v1762596053/task-img-02-8_gqmc6y.webp',
            'https://res.cloudinary.com/dxvkigop9/image/upload/v1762942856/task-img-03-8_snimg8.webp'
        ],
        seller: {
            name: 'Jack Henry',
            avatar: jackHenryAvatar,
            verified: true,
            title: 'Professional Content Writer',
            hourlyRate: 60,
            rating: 0.0,
            reviews: 0,
            views: 725,
            location: 'United States (US)',
            residenceType: 'Agency',
            languages: 'English, French, German',
            englishLevel: 'Fluent',
            about: "I am an accomplished content writer driven by a deep passion for crafting captivating and informative materials that strike a chord with specific target audiences. My expertise spans a diverse range of content types, including compelling blog posts, engaging website copy, and persuasive marketing materials. At the heart of my work is a commitment to producing content that not only meets but exceeds client expectations.",
            skills: ['Artificial Intelligence', 'Content Writing', 'Marketing', 'Midjourney', 'SEO', 'Copywriting'],
            education: [
                {
                    degree: 'Bachelor of Arts in English Literature',
                    institution: 'University of California, Berkeley',
                    dates: 'October 10, 2015 - October 17, 2019',
                    description: 'Completed a comprehensive program focusing on literature analysis, writing proficiency, and creative expression.'
                },
                {
                    degree: 'Professional Writing Certification',
                    institution: 'Online Course',
                    dates: 'April 10, 2020',
                    description: 'Acquired specialized training in professional writing techniques, including content creation, copywriting, and digital marketing strategies.'
                }
            ],
            tasks: [ jackHenryTask ]
        },
        title: 'Compelling and Relevant Blog Content',
        stats: {
            rating: 0.0,
            reviews: 0,
            sales: 0,
            views: 1332,
        },
        description: "Looking for captivating and relevant blog content that engages your audience and boosts your online presence? You've come to the right place! I specialize in crafting high-quality, SEO-friendly blog posts that resonate with readers and drive traffic to your website. With a passion for storytelling and a commitment to delivering engaging content, I'm here to help you achieve your content marketing goals. Whether you need regular blog posts, guest articles, or content for your website, I'm ready to collaborate and create compelling narratives that resonate. Let's elevate your blog with compelling and relevant content. Contact me today to discuss your project needs and start creating content that captivates!",
        serviceFeatures: [
            'Researching and brainstorming topics that align with your brand and target audience.',
            'Creating original, well-researched, and informative blog articles that provide value.',
            'Optimizing content with relevant keywords and SEO best practices to improve search engine rankings.',
            'Crafting compelling headlines and introductions to grab readers\' attention.',
            'Incorporating visuals like images, infographics, and videos to enhance readability.',
            'Ensuring readability and coherence with proper structure, grammar, and style.',
            'Tailoring content for different platforms and audiences, including social media sharing.',
            'Adhering to deadlines and delivering polished blog posts ready for publishing.',
            'Offering topic ideation and content strategy consulting to enhance your blog\'s effectiveness.',
            'Providing revisions based on feedback to ensure satisfaction and alignment with your vision.',
        ],
        additionalServices: [
            { title: 'Analytics and Reporting', description: 'I can assist in setting up advanced analytics tracking to help monitor the performance of your blog content and provide data-driven decision-making to optimize results.', price: 100 },
            { title: 'SEO Copywriting', description: 'I have experience implementing SEO best practices into content writing to enhance search engine rankings and organic visibility.', price: 200 }
        ],
        tags: ["CMS", "Management", "Marketing", "PR", "SEO", "Theme", "WordPress"],
        faq: [
            {
                question: 'How do you approach topic ideation for blog posts?',
                answer: 'I conduct thorough research to identify trending topics, industry news, and audience interests to create engaging blog post ideas.'
            },
            {
                question: 'Can you optimize content for specific SEO keywords?',
                answer: 'Yes, I specialize in keyword research and on-page SEO to ensure your content is optimized for search engines and reaches a wider audience.'
            },
            {
                question: 'What types of industries have you worked with for content writing?',
                answer: 'I have experience writing for various industries, including technology, finance, healthcare, and lifestyle, adapting my writing style to suit each audience.'
            }
        ],
        packages: {
            basic: { name: 'Essentials', price: 80, delivery: 2, description: 'Includes a well-researched and 500-word blog post.', features: ['Content Writing and Proofreading (20)'] },
            standard: { name: 'Regular', price: 150, delivery: 4, description: 'Includes a 1000-word blog post with SEO optimization.', features: ['Everything in Essentials', 'SEO Keyword Research', '1 Revision'] },
            premium: { name: 'Pro', price: 300, delivery: 6, description: 'A comprehensive content package with multiple articles and strategy.', features: ['Everything in Regular', 'Two 1000-word articles', 'Content Strategy Session'] },
        },
        rating: 0,
        reviews: 0,
        location: 'United States (US)',
        price: 80,
    },
    {
        ...alexMooreTask,
        id: 6, // Original ID
        gallery: [
            'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=2070&auto=format&fit=crop'
        ],
        seller: {
            name: 'Alex Moore',
            avatar: alexMooreAvatar,
            verified: true,
            title: 'Professional WordPress Developer',
            hourlyRate: 70,
            rating: 0.0,
            reviews: 0,
            views: 675,
            location: 'Germany',
            residenceType: 'Independent',
            languages: 'English, German',
            englishLevel: 'Fluent',
            about: "As a WordPress developer, I have extensive experience constructing custom websites and themes to meet individual client needs. My expertise lies in creating dynamic, user-centric WordPress solutions that prioritize responsiveness and usability. By leveraging my deep knowledge of WordPress, I design and develop custom websites that seamlessly blend functionality with aesthetics.",
            skills: ['AI Development', 'Marketing', 'Midjourney', 'Plugin Development', 'Programming', 'Theme Development', 'CMS'],
            education: [
                {
                    degree: 'Bachelor of Science in Computer Science',
                    institution: 'Technical University of Munich',
                    dates: 'October 29, 2015 - November 29, 2019',
                    description: 'Completed a comprehensive computer science program focusing on software development and web technologies.'
                },
                {
                    degree: 'WordPress Development Certification',
                    institution: 'Online Course',
                    dates: 'August 21, 2020',
                    description: 'Acquired specialized training in WordPress theme and plugin development, website customization, and optimization.'
                }
            ],
            tasks: [ { ...alexMooreTask, seller: { name: 'Alex Moore', avatar: alexMooreAvatar, verified: true } } ]
        },
        stats: {
            rating: 0.0,
            reviews: 0,
            sales: 0,
            views: 841,
        },
        description: "Looking for a stunning Custom WordPress Website? You're in the right place! I specialize in creating bespoke WordPress websites that are tailored to your brand, easy to manage, and optimized for performance. Whether you need a personal blog, portfolio website, business site, or online store, I can bring your vision to life with a custom WordPress solution. I focus on delivering high-quality, functional websites that meet your specific goals and requirements. Let's collaborate to build a professional and visually appealing WordPress website that reflects your brand and engages your audience. Contact me today to discuss your project and get started!",
        serviceFeatures: [
            "Custom design and development of WordPress websites from scratch.",
            "Responsive web design to ensure your site looks great on all devices.",
            "Integration of custom features and functionalities using WordPress plugins and custom coding.",
            "Optimization for speed and SEO (Search Engine Optimization) to improve visibility and user experience.",
            "E-commerce solutions with WooCommerce integration for online stores and product showcases.",
            "Integration of third-party services such as payment gateways, APIs, and CRM systems.",
            "Migration of existing websites to WordPress for enhanced flexibility and ease of use.",
            "Customization of themes and templates to match your unique brand identity.",
            "Training and support to empower you to manage and update your WordPress site independently.",
            "Ongoing maintenance and updates to keep your website secure and up to date."
        ],
        additionalServices: [
            { title: 'WordPress Maintenance and Support', description: 'I specialize in providing ongoing maintenance and support for WordPress websites, ensuring they remain secure, up-to-date, and optimized for performance.', price: 150 },
            { title: 'WordPress Website Optimization', description: 'I specialize in optimizing WordPress websites for performance, security, and SEO best practices to enhance overall functionality and user experience.', price: 150 }
        ],
        tags: ["CMS", "CSS", "Development", "HTML", "Javascript", "JQuery", "PHP"],
        faq: [
            {
                question: 'What are the benefits of using WordPress for website development?',
                answer: 'WordPress offers flexibility, scalability, and a vast ecosystem of plugins and themes, making it ideal for building custom websites with diverse functionalities.'
            },
            {
                question: 'Can you integrate third-party services into WordPress websites?',
                answer: 'Yes, I can integrate a wide range of third-party services, including payment gateways, CRM systems, and social media platforms, to extend the functionality of your WordPress site.'
            },
            {
                question: 'Do you provide training for clients to manage their WordPress websites?',
                answer: 'Absolutely. I offer comprehensive training to ensure you are comfortable managing your website content, updating plugins, and performing routine maintenance tasks.'
            },
            {
                question: 'How do you ensure WordPress websites are secure?',
                answer: 'I follow best practices for WordPress security, including using trusted plugins, implementing firewalls, and keeping the core, themes, and plugins updated to protect against vulnerabilities.'
            }
        ],
        packages: {
            basic: { name: 'Essentials', price: 250, delivery: 2, description: 'Includes development of a basic WordPress website.', features: ['Custom Design', 'Responsive Design'] },
            standard: { name: 'Standard', price: 600, delivery: 5, description: 'A more advanced site with additional features.', features: ['Everything in Essentials', 'Up to 10 pages', 'Basic SEO'] },
            premium: { name: 'Premium', price: 1200, delivery: 10, description: 'A full e-commerce solution or complex business site.', features: ['Everything in Standard', 'E-commerce setup', 'Advanced customization'] }
        },
        rating: 0,
        reviews: 0,
        location: 'France',
        price: 50,
    },
];
