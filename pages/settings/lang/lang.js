// pages/settings/lang/lang.js
import Lookup from '../../../js/config/lookup.js';
import Config from '../../../js/config/config.js';

Page({
    
    onLangChange(event) {
        let lang = event.detail.value;
        Lookup.notification.notify({ name: "lang.change", attachment: lang });
        Config.set("lang", lang);
    }
})