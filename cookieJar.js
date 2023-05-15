/*

A JavaScript plugin that makes the use of website cookies easier. The built in 'CookieStore' Web API is still experimental and still not compatible with every browser, so :v.
Originally made for MINDWORLD: Host Connected.

Version : 0.4a

By CalmBubbles :)

*/

class cookieJar
{
    static getCookie (name)
    {
        if (name == null) throw new Error("Data needed for js-plugins class method 'cookieJar.getCookie' is undefined");
        
        const cookies = document.cookie;
        const cookieList = cookies.split("; ");
        
        for (let i = 0; i < cookieList.length; i++)
        {
            const cookie = cookieList[i];
            const properties = cookie.split("=");
            
            if (properties[0] === name) return decodeURIComponent(properties[1]);
        }
        
        return "";
    }
    
    static setCookie (name, value, path, expiration)
    {
        if (name == null || value == null) throw new Error("Data needed for js-plugins class method 'cookieJar.setCookie' is undefined");
        
        let expires = "";
        
        if (expiration != null)
        {
            const validType = expiration instanceof Date;
            
            if (!validType) throw new Error("Data for js-plugins class method 'cookieJar.setCookie' is not in valid type");
            
            expires = `; expires=${expiration.toUTCString()}`;
        }
        
        document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=${path ?? "/"}${expires}`;
    }
    
    static removeCookie (name, path)
    {
        if (name == null) throw new Error("Data needed for js-plugins class method 'cookieJar.removeCookie' is undefined");
        
        document.cookie = `${encodeURIComponent(name)}=0; path=${path ?? "/"}; expires=${new Date(0).toUTCString()}`;
    }
}