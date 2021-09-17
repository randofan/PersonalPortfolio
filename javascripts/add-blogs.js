const list = document.createElement('ul');
const storage = document.createElement('ul')
storage.style.padding = 0
const readMore = document.getElementById('read-more-btn')
const fade = document.getElementById('fade')
list.id = 'blog-list'

const app = document.querySelector('#posts');

let isFirst = true
fetch("/misc/blog.json")
    .then(response => response.json())
    .then(json => json.posts)
    .then(posts => Object.values(posts))
    .then(arr => arr.forEach(post => {

        let li = document.createElement('li')

        let date = document.createElement('h2')
        let title = document.createElement('h3')
        let content = document.createElement('p')
        let signature = document.createElement('p')

        date.textContent = post.date
        title.textContent = post.title.toUpperCase()
        content.innerHTML = post.content
        signature.innerHTML = post.signature

        li.classList = 'blog-list-item'
        title.classList = 'primary'

        li.appendChild(date)
        li.appendChild(title)
        li.appendChild(content)
        li.appendChild(signature)

        if (isFirst === true) {
            list.appendChild(li)
            storage.appendChild(li.cloneNode(true))
            isFirst = false
        }
        else {
            storage.appendChild(li)
        }
    }))

app.appendChild(list);

readMore.addEventListener('click', () => {
    if(readMore.textContent.includes('More')) { // if it is read more
        app.replaceChild(storage, list)
        fade.style.filter = 'opacity(0)'
        readMore.innerHTML = '&#9650<br class="no-space">Read Less'
    }
    else { // if it is read less
        app.replaceChild(list, storage)
        fade.style.removeProperty('filter')
        readMore.innerHTML = 'Read More<br class="no-space">&#9660'
    }
})
