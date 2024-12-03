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
    const sidebar = document.querySelector<HTMLElement>('.sidebar');
    const toggleBtn = document.querySelector<HTMLElement>('.sidebar-toggle');
    const closeBtn = document.querySelector<HTMLElement>('.sidebar-close');
    const map = document.getElementById('map');

    if (!sidebar || !toggleBtn || !closeBtn || !map) return;

    const toggleSidebar = (e: Event) => {
        e.stopPropagation(); // Prevent event from bubbling up
        sidebar.classList.toggle('open');
        map.classList.toggle('sidebar-open');
    };

    const closeSidebar = () => {
        sidebar.classList.remove('open');
        map.classList.remove('sidebar-open');
    };

    toggleBtn.addEventListener('click', toggleSidebar);
    closeBtn.addEventListener('click', toggleSidebar);

    // Close sidebar when clicking outside
    document.addEventListener('click', (e: Event) => {
        const target = e.target as HTMLElement;
        if (sidebar.classList.contains('open') &&
            !sidebar.contains(target) &&
            !toggleBtn.contains(target)) {
            closeSidebar();
        }
    });

    // Prevent clicks within sidebar from closing it
    sidebar.addEventListener('click', (e: Event) => {
        e.stopPropagation();
    });
};

// Initialize the controls
export const initializeControls = (): void => {
    setupMobileHandle();
    setupContainerToggles();
    setupSidebarToggle();
};