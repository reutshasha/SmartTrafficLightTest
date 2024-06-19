import { Directive, HostListener, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { ScreenUtil } from '../utilities/screen.util';

@Directive({ selector: "[ifScreenAbove], [ifScreenBelow]" })
export class IfScreenDirective implements OnInit {

    @Input('ifScreenAbove') ifScreenAbove!: string;
    @Input('ifScreenBelow') ifScreenBelow!: string;

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private screenUtil: ScreenUtil
    ) { }

    ngOnInit() {
        this.refreshShow();
    }

    @HostListener('window:resize')
    onResize() {
        this.refreshShow();
    }

    refreshShow() {
        if (this.ifScreenAbove !== undefined) {
            switch (this.ifScreenAbove) {
                case 'xs':
                    return this.showOrHide(this.screenUtil.isHigherThanXS());
                case 'sm':
                    return this.showOrHide(this.screenUtil.isHigherThanSM());
                case 'md':
                    return this.showOrHide(this.screenUtil.isHigherThanMD());
                case 'lg':
                    return this.showOrHide(this.screenUtil.isHigherThanLG());
            }
        } else if (this.ifScreenBelow !== undefined) {
            switch (this.ifScreenBelow) {
                case 'xs':
                    return this.showOrHide(this.screenUtil.isLowerThanXS());
                case 'sm':
                    return this.showOrHide(this.screenUtil.isLowerThanSM());
                case 'md':
                    return this.showOrHide(this.screenUtil.isLowerThanMD());
                case 'lg':
                    return this.showOrHide(this.screenUtil.isLowerThanLG());
            }
        }
    }

    showOrHide(show: boolean) {
        if (show) {
            if (!this.viewContainer.length) {
                this.viewContainer.createEmbeddedView(this.templateRef);
            }
        } else {
            this.viewContainer.clear();
        }
    }

}