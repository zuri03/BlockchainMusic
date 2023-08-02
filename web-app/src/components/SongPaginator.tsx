interface Paging {
    offset: number,
    pageSize: number,
    totalCount: number
}

const PAGE_RENDER_LIMIT = 2;

const Container = function ({ child }: { child: any }) {
    return (
        <div ref={ ref => ref?.appendChild(child)}></div>
    )
}

export default function SongPaginator({ offset, pageSize, totalCount }: Paging) {
    alert('init song paginator')

    const navContainer = document.createElement('nav');
    navContainer.ariaLabel = 'Page navigation example';
    const ulContainer = document.createElement('ul');
    ulContainer.classList.add('pagination', 'justify-content-center');

    //calculate the current page based on the offset with this formula 
    //take the current offset divide it by 10 and add 1 since pages start at 1 while the offset starts at 0
    //Since pageSize is currently limited to 10 the offset will always be divisible by 10
    const currentPage = (offset / pageSize) + 1;
    if (currentPage === 1) {
        const liContainer = document.createElement('li');
        liContainer.classList.add('page-item', 'disabled');
        
        const aContainer = document.createElement('a');
        aContainer.classList.add('page-link');
        aContainer.href = '#';
        aContainer.innerText = 'Previous'
    } else {
        //TODO: Determine the best way in react to navigate to previous page
        //For now just disable the previous button
        const liContainer = document.createElement('li');
        liContainer.classList.add('page-item', 'disabled');
        
        const aContainer = document.createElement('a');
        aContainer.classList.add('page-link');
        aContainer.href = '#';
        aContainer.innerText = 'Previous'
    }

    const limit = Math.min(currentPage + PAGE_RENDER_LIMIT, Math.ceil(totalCount / pageSize));

    for (let i = Math.max((currentPage - PAGE_RENDER_LIMIT), 1); i <= limit; i++) {
        let paginationContainer = document.createElement('li');
        paginationContainer.classList.add('page-item');
        let aContainer = document.createElement('a');
        aContainer.classList.add('page-link');
        aContainer.href = '#';

        if (i === currentPage) {
            paginationContainer.classList.add('active');
        } else {
            paginationContainer.style.cursor = 'pointer'
            aContainer.classList.add('available-link');
        }

        aContainer.innerText = i.toString();
        paginationContainer.appendChild(aContainer);
        ulContainer.appendChild(paginationContainer);
    }

    let nextContainer = document.createElement('li');
    nextContainer.classList.add('page-item')
    let aContainer = document.createElement('a');
    aContainer.classList.add('page-link');
    aContainer.href = '#';
    aContainer.innerText = 'Next';

    if (currentPage === limit) {
        nextContainer.classList.add('disabled')
    } else {
        nextContainer.style.cursor = 'pointer';
        aContainer.classList.add('available-link');
    }

    nextContainer.appendChild(aContainer);
    ulContainer.appendChild(nextContainer);
    navContainer.appendChild(ulContainer);

    return (
        <Container child={navContainer} />
    )
}