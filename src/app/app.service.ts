import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root',
})
export class UtilityService {

    constructor(private cookie: CookieService) {

    }

    addFavourite = (item) => {
        const favourites = JSON.parse(this.cookie.get('favourites') || '[]');
        const newFavourites = [item, ...favourites];
        this.cookie.set('favourites', JSON.stringify(newFavourites))
    }

    removeFavourite = (item) => {
        const favourites = JSON.parse(this.cookie.get('favourites') || '[]');
        const favouriteIndex = favourites.indexOf(item);
        if(favouriteIndex === -1) {
            return;
        }
        const newFavourites = favourites.splice(favouriteIndex, 1)
        this.cookie.set('favourites', JSON.stringify(newFavourites))
    }

    getFavourites = () => {
        const favourites = JSON.parse(this.cookie.get('favourites') || '[]');
        return favourites ;
    }

    decodeEntities = (function () {
        // this prevents any overhead from creating the object each time
        let element = document.createElement('div');

        function decodeHTMLEntities(str) {
            if (str && typeof str === 'string') {
                // strip script/html tags
                str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
                str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
                element.innerHTML = str;
                str = element.textContent;
                element.textContent = '';
            }

            return str;
        }

        return decodeHTMLEntities;
    })();

}