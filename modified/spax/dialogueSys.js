/*

A JavaScript plugin that adds a div based RPG style dialogue system. Which includes animation, audio, images and function call logic.
Originally made for SpiritAxolotl's birthday.

Version : 1f - SpaxDay Modified

By CalmBubbles :)

*/

class dialogueSys
{
    constructor (dialogueBox, blockedText, characters, animIn, animInTime, animOut, animOutTime, imgSrc, audioSrc)
    {
        this.diaBox = dialogueBox;
        this.blockedChars = blockedText;
        this.peeps = characters;
        this.animIn = animIn;
        this.animInTime = animInTime;
        this.animOut = animOut;
        this.animOutTime = animOutTime;
        this.imgSrc = imgSrc;
        this.audioSrc = audioSrc;
        this.audioVol = 0.75;
        
        var newDBL = document.createElement("div");
        this.diaBox.appendChild(newDBL);
        
        this.diaBoxLine = this.diaBox.querySelector("div");
        this.diaBox.setAttribute("data-disabled", "true");
        
        this.whenTypingFunc = function () { };
        this.notTypingFunc = function () { };
    }
    
    SetActive (state, funcAfter)
    {
        var animInTime = this.animInTime;
        var animOutTime = this.animOutTime;
        
        this.SpecialBox = null;
        
        if (funcAfter == null) funcAfter = function () { };
        
        if (state == true)
        {
            this.diaBox.style.animation = `${this.animIn} ${animInTime}s`;
            
            setTimeout(() => {
                this.diaBox.setAttribute("data-disabled", "false");
                this.diaBox.style.animation = "none";
                
                this.diaIsActive = true;
                
                funcAfter();
            }, animInTime * 1000);
        }
        else
        {
            this.diaIsActive = false;
            
            this.diaBoxLine.innerHTML = "";
            
            this.diaBox.style.animation = `${this.animOut} ${animOutTime}s`;
            
            setTimeout(() => {
                this.diaBox.setAttribute("data-disabled", "true");
                this.diaBox.style.animation = "none";
                funcAfter();
            }, animOutTime * 1000);
        }
    }
    
    typeOnBox (text, speed, person, face, funcAfter)
    {
        if (!this.diaIsActive) return;
        
        var index = 0;
        var interval;
        var sndSrc;
        var validPeep = false;
        
        for (let i = 0; i < this.peeps.length; i++)
        {
            if (person == this.peeps[i])
            {
                validPeep = true;
            }
        }
        
        if (validPeep != this.SpecialBox)
        {
            if (validPeep)
            {
                var imageVar = "";
                
                if (!spaxFixed)
                {
                    imageVar = ` class="spaxDayECtext-boximg spaxDayEA"`;
                }
                
                this.diaBoxLine.innerHTML = `<img${imageVar} src="${this.imgSrc}/${person}/${face}.png"><span></span>`;
                
                this.textBox = this.diaBoxLine.querySelector("span");
                
                sndSrc = `${this.audioSrc}/${person}.ogg`;
            }
            else
            {
                this.diaBoxLine.innerHTML = "<span></span>";
                
                this.textBox = this.diaBoxLine.querySelector("span");
                
                sndSrc = `${this.audioSrc}/default.ogg`;
            }
            
            this.SpecialBox = validPeep;
        }
        else
        {
            if (validPeep)
            {
                this.diaBoxLine.querySelector("img").src = `${this.imgSrc}/${person}/${face}.png`;
                
                sndSrc = `${this.audioSrc}/${person}.ogg`;
            }
            else
            {
                sndSrc = `${this.audioSrc}/default.ogg`;
            }
        }
        
        this.whenTypingFunc();
        
        interval = setInterval(() => {
            var textSnd = new Audio(sndSrc);
            textSnd.volume = this.audioVol;
            var shouldPlaySnd = false;
            
            if (index < text.length)
            {
                for (let i = 0; i < this.blockedChars.length; i++)
                {
                    if (text[index] != this.blockedChars[i])
                    {
                        shouldPlaySnd = true;
                    }
                }
                
                if (shouldPlaySnd)
                {
                    textSnd.play();
                }
                
                this.textBox.innerHTML += text[index];
                
                index++;
            }
            
            if (index == text.length)
            {
                clearInterval(interval);
                this.notTypingFunc();
                funcAfter();
            }
        }, (24 / speed));
    }
    
    lineBreakBox (amount)
    {
        for (let i = 0; i < amount; i++)
        {
            this.textBox.innerHTML += "<br>";
        }
    }
    
    resetBoxTo (text)
    {
        this.textBox.innerHTML = text;
    }
    
    clearBox ()
    {
        this.diaBoxLine.innerHTML = "";
        this.SpecialBox = null;
    }
}