interface LocalBusinessConfig {
    /** schema.org type — 'LocalBusiness' or a more specific subtype e.g. 'SportsActivityLocation', 'Restaurant'. */
    type: string;
    telephone: string;
    address: {
        streetAddress: string;
        addressLocality: string;
        addressRegion: string;
        postalCode: string;
        addressCountry: string;
    };
    /** schema.org opening hours spec strings, e.g. "Mo-Fr 09:00-18:00". */
    openingHours: string[];
    aggregateRating?: {
        ratingValue: number;
        reviewCount: number;
    };
}

export const siteConfig = {
    name: 'Shoppingo',
    title: 'Shoppingo: shared shopping lists, recipes and meal plans',
    description:
        'A shared shopping list that works offline, imports recipes from any link and plans your week of meals. Free and open source.',
    // Guarded with `typeof process !== 'undefined'` because this module is also imported by
    // client-hydrated islands (Navbar, FAQ), where `process` doesn't exist and a bare
    // `process.env` access throws `ReferenceError: process is not defined` on hydration.
    // `|| ` (not `??`): an unset `vars.SITE_URL` in CI is passed through as `''`, not
    // undefined — `??` wouldn't fall back for that. Guarded with `typeof process !==
    // 'undefined'` because this module is also imported by client-hydrated islands
    // (Navbar, FAQ), where `process` doesn't exist and a bare `process.env` access
    // throws `ReferenceError: process is not defined` on hydration.
    url: (typeof process !== 'undefined' ? process.env.SITE_URL : undefined) || 'http://localhost:4321',
    locale: 'en',
    social: {
        twitter: '',
    },
    defaultOgImage: '/og-default.png',
    /**
     * Set this for a local-business site (address/hours/phone/rating) to get
     * LocalBusiness JSON-LD instead of generic Organization — leave undefined
     * for a non-local-business content site.
     */
    business: undefined as LocalBusinessConfig | undefined,
    appUrl: 'https://shoppingo-app.imapps.uk',
    repoUrl: 'https://github.com/igor-siergiej/shoppingo',
    faqs: [
        {
            question: 'Is Shoppingo free?',
            answer: 'Yes. There are no ads and no paid tier. Shoppingo is open source under the AGPL licence.',
        },
        {
            question: 'Is there an app in the App Store or Play Store?',
            answer: 'Not yet. Shoppingo is a web app you install from your browser. On iPhone, open it in Safari and choose Share, then Add to Home Screen. On Android, choose Install app from the browser menu. It then opens full screen like any other app.',
        },
        {
            question: 'Does it work without signal in the shop?',
            answer: 'Yes. Your lists are saved on your phone, so you can tick items off with no connection. Changes sync to everyone else as soon as you are back online.',
        },
        {
            question: 'Who can see my lists and recipes?',
            answer: 'Only you and the friends you share them with. Recipes become public only if you choose to publish one to the Discover library.',
        },
        {
            question: 'Where do the Discover recipes come from?',
            answer: 'Most come from the Wikibooks Cookbook, shared under a Creative Commons licence and credited on every recipe. The rest are recipes Shoppingo users chose to publish.',
        },
        {
            question: 'Can I run my own copy?',
            answer: 'Yes. The repository includes a Docker Compose file that starts the whole stack on your own server.',
        },
    ] as { question: string; answer: string }[],
};
