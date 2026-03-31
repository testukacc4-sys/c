function copyFullStory(postElement, btn) {
    // 1. "See more" බොත්තම සොයා එය ක්ලික් කරයි
    const seeMoreBtn = postElement.querySelector('div[role="button"]');
    if (seeMoreBtn && (seeMoreBtn.innerText.includes("See more") || seeMoreBtn.innerText.includes("තවත් බලන්න"))) {
        seeMoreBtn.click();
    }

    // 2. ටෙක්ස්ට් එක ලෝඩ් වන තෙක් තත්පර භාගයක් රැඳී සිටියි
    setTimeout(() => {
        // ප්‍රධාන පෝස්ට් එකේ විස්තරය ඇති span එක සොයයි
        const textContainer = postElement.querySelector('div[data-ad-preview="message"]') || 
                            postElement.querySelector('div[dir="auto"] span[dir="auto"]');

        if (textContainer) {
            let fullText = textContainer.innerText.replace(/See more|තවත් බලන්න/g, "").trim();
            
            navigator.clipboard.writeText(fullText).then(() => {
                btn.innerText = "Copied!";
                btn.style.backgroundColor = "#28a745";
                setTimeout(() => {
                    btn.innerText = "Copy Story";
                    btn.style.backgroundColor = "#0866FF";
                }, 2000);
            });
        } else {
            alert("Description එක සොයාගත නොහැකි විය.");
        }
    }, 500);
}

function injectButton() {
    // කමෙන්ට් වල ඇති බොත්තම් මකා දමා, ප්‍රධාන පෝස්ට් එක පමණක් තෝරා ගනී
    // සාමාන්‍යයෙන් ප්‍රධාන පෝස්ට් එකක 'data-ad-preview="message"' පවතී.
    const mainPosts = document.querySelectorAll('div[role="article"]:not(.copy-btn-added)');

    mainPosts.forEach(post => {
        // මෙය කමෙන්ට් එකක් දැයි පරීක්ෂා කිරීම (කමෙන්ට් වල සාමාන්‍යයෙන් role="article" තිබුණත් ඒවා nested වේ)
        if (post.closest('ul') || post.getAttribute('role') === 'presentation') return;

        post.classList.add('copy-btn-added');

        const btn = document.createElement('button');
        btn.innerText = "Copy Story";
        btn.className = "fb-main-copy-btn";
        
        btn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            copyFullStory(post, btn);
        };

        // පෝස්ට් එකේ ඉහළ කොටසට (Header) බොත්තම එක් කරයි
        const header = post.querySelector('div[role="button"]') || post;
        post.appendChild(btn);
    });
}

// පේජ් එක scroll කරන විට අලුත් පෝස්ට් සඳහා බොත්තම ඇතුළත් කිරීමට
const observer = new MutationObserver(injectButton);
observer.observe(document.body, { childList: true, subtree: true });

injectButton();
