class GeneralSetting {
    constructor(webName, webEmail, webHotline, webLogoHori, webLogoVerti, webLogoIcon, openHours, closeHours, platformFee, otherFee, helperShare) {
        this.webName = webName;
        this.webEmail = webEmail;
        this.webHotline = webHotline;
        this.webLogoHori = webLogoHori;
        this.webLogoVerti = webLogoVerti;
        this.webLogoIcon = webLogoIcon;
        this.openHours = openHours;
        this.closeHours = closeHours;
        this.platformFee = platformFee;
        this.otherFee = otherFee;
        this.helperShare = helperShare;
    }
}

module.exports = GeneralSetting;