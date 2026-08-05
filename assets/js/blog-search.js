// Filters the blog list against the hidden full-archive index rendered by
// _layouts/blog.html. A query is a mix of free text (matched against title and
// description) and #tags; tags must all match, text is a substring match.
(function () {
    var input = document.getElementById('blog-search-input');
    var list = document.getElementById('blog-list');
    var index = document.getElementById('blog-list-all');
    var status = document.getElementById('blog-search-status');
    var pagination = document.getElementById('blog-pagination');

    if (!input || !list || !index || !status) {
        return;
    }

    var paginatedItems = Array.prototype.slice.call(list.children);
    var allItems = Array.prototype.slice.call(index.children);

    function parse(raw) {
        var tokens = raw.toLowerCase().split(/\s+/).filter(Boolean);
        var tags = [];
        var words = [];

        tokens.forEach(function (token) {
            if (token.charAt(0) === '#' && token.length > 1) {
                tags.push(token.slice(1));
            } else {
                words.push(token);
            }
        });

        return { tags: tags, text: words.join(' ') };
    }

    function matches(item, query) {
        var itemTags = (item.dataset.tags || '').split(/\s+/);
        var hasAllTags = query.tags.every(function (tag) {
            return itemTags.indexOf(tag) !== -1;
        });

        if (!hasAllTags) {
            return false;
        }

        if (!query.text) {
            return true;
        }

        var haystack = ((item.dataset.title || '') + ' ' + (item.dataset.description || '')).toLowerCase();
        return haystack.indexOf(query.text) !== -1;
    }

    function showStatus(count) {
        status.textContent = count + (count === 1 ? ' post' : ' posts') + ' found. ';

        var clear = document.createElement('a');
        clear.href = '/blog/';
        clear.className = 'blog-search-clear';
        clear.textContent = 'Clear';
        clear.addEventListener('click', function (event) {
            event.preventDefault();
            input.value = '';
            apply();
            input.focus();
        });

        status.appendChild(clear);
        status.hidden = false;
    }

    function apply() {
        var raw = input.value.trim();
        var url = new URL(window.location.href);

        if (!raw) {
            list.replaceChildren.apply(list, paginatedItems);
            status.hidden = true;
            if (pagination) {
                pagination.hidden = false;
            }
            url.searchParams.delete('tag');
            history.replaceState(null, '', url);
            return;
        }

        var query = parse(raw);
        var found = allItems.filter(function (item) {
            return matches(item, query);
        });

        list.replaceChildren.apply(list, found.map(function (item) {
            return item.cloneNode(true);
        }));

        if (pagination) {
            pagination.hidden = true;
        }

        showStatus(found.length);

        if (query.tags.length === 1 && !query.text) {
            url.searchParams.set('tag', query.tags[0]);
        } else {
            url.searchParams.delete('tag');
        }
        history.replaceState(null, '', url);
    }

    input.addEventListener('input', apply);

    // Tag chips inside the list filter in place rather than reloading the page.
    // Their href still points at /blog/?tag=… so they work without JS.
    list.addEventListener('click', function (event) {
        var chip = event.target.closest('.tag-chip');
        if (!chip) {
            return;
        }

        event.preventDefault();
        input.value = '#' + new URL(chip.href).searchParams.get('tag');
        apply();
    });

    var initialTag = new URL(window.location.href).searchParams.get('tag');
    if (initialTag) {
        input.value = '#' + initialTag;
        apply();
    }
})();
