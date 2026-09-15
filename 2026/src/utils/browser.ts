export const isInAppBrowser = (): boolean => {
    const rules = [
        'WebView',
        '(iPhone|iPod|iPad)(?!.*Safari/)',
        'Android.*(wv|.0.0.0)',
        'Linux; U; Android'
    ];
    const regex = new RegExp(`(${rules.join('|')})`, 'ig');
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

    // Check mostly used specific tokens
    const specificApps = /Instagram|FBAN|FBAV|Snapchat|LinkedIn|Twitter|Threads/i;

    return Boolean(userAgent.match(regex)) || specificApps.test(userAgent);
};
