import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ScreenUtil {

    readonly SCREEN_XS: number = 576;
    readonly SCREEN_SM: number = 768;
    readonly SCREEN_MD: number = 992;
    readonly SCREEN_LG: number = 1200;

    /**
     * Gets the current screen width (in pixels).
     * @returns Returns the current screen width (in pixels).
     */
    public getCurrentWidth(): number {
        return (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);
    }

    /**
     * Checks whether the current screen width is lower than XS.
     * @returns Returns true if the current screen width is lower than XS, otherwise false.
     */
    public isLowerThanXS(): boolean {
        return (this.getCurrentWidth() < this.SCREEN_XS);
    }

    /**
    * Checks whether the current screen width is lower than SM.
    * @returns Returns true if the current screen width is lower than SM, otherwise false.
    */
    public isLowerThanSM(): boolean {
        return (this.getCurrentWidth() < this.SCREEN_SM);
    }

    /**
    * Checks whether the current screen width is lower than MD.
    * @returns Returns true if the current screen width is lower than MD, otherwise false.
    */
    public isLowerThanMD(): boolean {
        return (this.getCurrentWidth() < this.SCREEN_MD);
    }

    /**
    * Checks whether the current screen width is lower than LG.
    * @returns Returns true if the current screen width is lower than LG, otherwise false.
    */
    public isLowerThanLG(): boolean {
        return (this.getCurrentWidth() < this.SCREEN_LG);
    }

    /**
     * Checks whether the current screen width is higher than XS.
     * @returns Returns true if the current screen width is higher than XS, otherwise false.
     */
    public isHigherThanXS(): boolean {
        return !this.isLowerThanXS();
    }

    /**
    * Checks whether the current screen width is higher than SM.
    * @returns Returns true if the current screen width is higher than SM, otherwise false.
    */
    public isHigherThanSM(): boolean {
        return !this.isLowerThanSM();
    }

    /**
    * Checks whether the current screen width is higher than MD.
    * @returns Returns true if the current screen width is higher than MD, otherwise false.
    */
    public isHigherThanMD(): boolean {
        return !this.isLowerThanMD();
    }

    /**
    * Checks whether the current screen width is higher than LG.
    * @returns Returns true if the current screen width is higher than LG, otherwise false.
    */
    public isHigherThanLG(): boolean {
        return !this.isLowerThanLG();
    }

    /**
     * Checks whether the current screen width is XS (and below).
     * @returns Returns true if the current screen width is XS (and below), otherwise false.
     */
    public isXS(): boolean {
        return (this.getCurrentWidth() <= this.SCREEN_XS);
    }

    /**
     * Checks whether the current screen width is SM (and above XS).
     * @returns Returns true if the current screen width is SM (and above XS), otherwise false.
     */
    public isSM(): boolean {
        const width = this.getCurrentWidth();
        return (width <= this.SCREEN_SM && width > this.SCREEN_XS);
    }

    /**
     * Checks whether the current screen width is MD (and above SM).
     * @returns Returns true if the current screen width is MD (and above SM), otherwise false.
     */
    public isMD(): boolean {
        const width = this.getCurrentWidth();
        return (width <= this.SCREEN_MD && width > this.SCREEN_SM);
    }

    /**
     * Checks whether the current screen width is LG (and above MD).
     * @returns Returns true if the current screen width is LG (and above MD), otherwise false.
     */
    public isLG(): boolean {
        const width = this.getCurrentWidth();
        return (this.getCurrentWidth() > this.SCREEN_MD);
    }

}