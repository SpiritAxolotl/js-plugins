/*

A JavaScript plugin that makes the use of website cookies easier. The built in 'CookieStore' Web API is still experimental and still not compatible with every browser, so :v.
Originally made for MINDWORLD: Host Connected.

Version : 0.3a

By CalmBubbles :)

*/

class cookieJar
{
    static getCrumb (name)
    {
        if (name == null) throw new Error("Data needed for js-plugins class method 'cookieJar.getCrumb' is undefined");
        
        const currentCookie = document.cookie;
        const cookieList = currentCookie.split("; ");
        
        for (let i = 0; i < cookieList.length; i++)
        {
            const crumb = cookieList[i];
            const properties = crumb.split("=");
            
            if (properties[0] === name) return decodeURIComponent(properties[1]);
        }
        
        return "";
    }
    
    static setCrumb (name, value, path, expiration)
    {
        if (name == null || value == null) throw new Error("Data needed for js-plugins class method 'cookieJar.setCrumb' is undefined");
        
        let expires = "";
        
        if (expiration != null)
        {
            const validType = expiration instanceof Date;
            
            if (!validType) throw new Error("Data for js-plugins class method 'cookieJar.setCrumb' is not in valid type");
            
            expires = `; expires=${expiration.toUTCString()}`;
        }
        
        document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=${path ?? "/"}${expires}`;
    }
    
    static removeCrumb (name, path)
    {
        if (name == null) throw new Error("Data needed for js-plugins class method 'cookieJar.removeCrumb' is undefined");
        
        document.cookie = `${encodeURIComponent(name)}=0; path=${path ?? "/"}; expires=${new Date(0).toUTCString()}`;
    }
}