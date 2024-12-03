const toggleElementClass = (element: Element, className: string): void => {
    element.classList.toggle(className);
};

const setupMobileHandle = (): void => {
    const handle = document.querySelector<HTMLElement>('.mobile-handle');
    if (!handle) return;

    handle.addEventListener('click', () => {
        const container = document.querySelector<HTMLElement>('.precipitation-container');
        if (!container) return;

        toggleElementClass(container, 'expanded');
    });
};

const setupContainerToggles = (): void => {
    const toggleSelector = `.toggle-btn, #layer-control h3, #legend-container h3`;
    const toggleElements = document.querySelectorAll<HTMLElement>(toggleSelector);

    toggleElements.forEach((element) => {
        element.addEventListener('click', (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'H3' || target.classList.contains('toggle-btn')) {
                const container = target.closest('#layer-control, #legend-container');
                if (!container) return;

                toggleElementClass(container, 'container-hidden');
            }
        });
    });
};

const setupSidebarToggle = (): void => {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebarClose = document.querySelector('.sidebar-close');
    if (!sidebarToggle || !sidebarClose) return;
    const map = document.getElementById('map');
    if (!map) return;

    const toggleSidebar = () => {
        sidebar.classList.toggle('open');
        map.classList.toggle('sidebar-open');
    };

    sidebarToggle.addEventListener('click', toggleSidebar);
    sidebarClose.addEventListener('click', toggleSidebar);
};

// Initialize the controls
const initializeControls = (): void => {
    setupMobileHandle();
    setupContainerToggles();
    setupSidebarToggle();
};

initializeControls();