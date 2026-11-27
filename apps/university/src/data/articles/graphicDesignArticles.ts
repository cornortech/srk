import type { Article } from './types';

export const graphicDesignArticles: Article[] = [
  {
    slug: 'principles-of-visual-hierarchy-every-designer-should-know',
    title: 'Principles of Visual Hierarchy Every Designer Should Know',
    topic: 'Graphic Design',
    topicSlug: 'graphic-design',
    excerpt:
      'Learn how to arrange type, color, spacing, and contrast so readers can find the important information first. Includes a worked event-poster example and a practical review checklist.',
    readTime: '5 min read',
    image:
      '/articles/principles-of-visual-hierarchy-every-designer-should-know-1.webp',
    content: [
      {
        type: 'p',
        text: 'Visual hierarchy is the order in which a design invites people to notice and read its elements. It matters on a concert poster, a web page, a slide, or a product label: if everything looks equally important, the viewer has to work out where to begin. Hierarchy does not mean making one item enormous and everything else tiny. It means making the most useful next step easy to recognize.',
      },
      {
        type: 'p',
        text: 'A useful way to check a layout is to look at it briefly, then look away. What do you remember first? If that answer is not the main message, adjust the design before adding decoration.',
      },
      {
        type: 'image',
        src: '/articles/principles-of-visual-hierarchy-every-designer-should-know-1.webp',
      },
      { type: 'h2', text: 'Start with the message, not the styling' },
      {
        type: 'p',
        text: 'Before choosing colors or typefaces, write down what someone needs to understand or do. For a workshop poster, that might be: what the workshop is, who it is for, when and where it happens, and how to register. Put those details in order. A decorative subtitle should not compete with the date, and a registration link should not be hard to find.',
      },
      {
        type: 'ol',
        items: [
          'Name the main audience and the one action or idea the design needs to communicate.',
          'List every required detail, then rank it from essential to supporting.',
          'Group related information, such as date, time, and location, so it reads as one unit.',
          'Choose a visual treatment for each level and check that the order still makes sense without color.',
        ],
      },
      {
        type: 'h2',
        text: 'Use scale and typography to show importance',
      },
      {
        type: 'p',
        text: 'Larger type tends to attract attention, so reserve the largest size for the main message rather than using it on several unrelated items. Build a small type scale—for example, a headline, a section label, and comfortable body text—and use those roles consistently. Weight can add another level of emphasis, but bolding every line removes the distinction.',
      },
      {
        type: 'p',
        text: 'Typeface choice also affects tone and legibility. A display face can work well for a short headline, while a simpler face is often easier to read in longer details. Keep line lengths manageable, give lines enough leading, and avoid shrinking essential information just to make a crowded layout fit. If the copy does not fit, edit or reorganize it before reducing the type to an uncomfortable size.',
      },
      {
        type: 'h3',
        text: 'A quick type-scale example',
      },
      {
        type: 'p',
        text: 'For the workshop poster, the workshop name might be the only large headline. A smaller but still prominent line can state the topic or intended audience. Date, time, and venue can share a readable detail style, while a clear button or short URL carries the action. The exact sizes depend on the format and viewing distance; print that will be read across a room needs different sizing from a phone screen.',
      },
      { type: 'h2', text: 'Create focus with contrast and color' },
      {
        type: 'p',
        text: 'Contrast can come from size, weight, shape, spacing, or color—not only from bright hues. A restrained palette is easier to manage: use a background, a main text color, and one accent for the element that needs attention. If the accent appears everywhere, it stops acting as an accent. Color meanings also vary by context, so do not depend on assumptions such as red always meaning urgency.',
      },
      {
        type: 'p',
        text: "Check text against its actual background, especially small text and text placed over photographs. For digital work, use a contrast checker and follow the accessibility requirements relevant to the project; WCAG's common minimum contrast ratios are 4.5:1 for normal text and 3:1 for large text. Color should not be the only way information is communicated: pair it with a label, icon, or other visible cue when the distinction matters.",
      },
      {
        type: 'image',
        src: '/articles/principles-of-visual-hierarchy-every-designer-should-know-2.webp',
      },
      { type: 'h2', text: 'Use spacing and alignment to organize content' },
      {
        type: 'p',
        text: 'Space is part of the layout, not leftover emptiness. Put related items closer together and separate sections that serve different purposes. Consistent margins and a simple alignment grid make a page easier to scan; they also expose elements that seem out of place. On a poster, for example, keep the date, time, and venue together rather than scattering them around the artwork.',
      },
      {
        type: 'p',
        text: 'Balance does not require making both sides identical. An asymmetrical layout can feel stable when visual weight is distributed deliberately—for instance, a large image can be balanced by a smaller block of text and open space. If the composition feels lopsided, try moving or resizing one element before adding another shape to compensate.',
      },
      { type: 'h2', text: 'A worked example: improve a crowded event poster' },
      {
        type: 'p',
        text: "Imagine a poster with the event title, sponsor logos, a paragraph of background information, three bright colors, and a registration URL all set at similar sizes. A reader may see the logos first simply because they are colorful, while the date gets lost. Rebuild the poster around the reader's questions:",
      },
      {
        type: 'ol',
        items: [
          'Make the event name the first clear focal point.',
          'Place the date, time, and venue together in a prominent, readable block.',
          'Shorten the background paragraph to the detail people need before deciding to attend.',
          'Give the registration instruction a distinct treatment and make the URL or QR code easy to locate.',
          'Reduce the logos and decorative elements to supporting roles, while keeping any required sponsor placement intact.',
        ],
      },
      {
        type: 'p',
        text: 'Then view the poster at its intended size and from a normal reading distance. If the date is still hard to find, adjust its placement or contrast rather than adding another bright color. A quick test with someone who has not seen the draft can reveal assumptions the designer no longer notices.',
      },
      {
        type: 'image',
        src: '/articles/principles-of-visual-hierarchy-every-designer-should-know-3.webp',
      },
      { type: 'h2', text: 'Review checklist before exporting' },
      {
        type: 'ul',
        items: [
          'Can a new viewer identify the main message at a glance?',
          'Are the next most useful details easy to find without hunting?',
          'Do headings, body text, and calls to action have clearly different roles?',
          'Is text readable at the actual size and on the actual background?',
          'Are related items grouped and unrelated sections given enough separation?',
          'Does the layout still make sense in grayscale or for someone who cannot distinguish the chosen colors?',
          'Have you checked the design on the device, paper size, or display where people will use it?',
        ],
      },
      {
        type: 'h2',
        text: 'Practice on a design you already have',
      },
      {
        type: 'p',
        text: 'Choose an existing flyer or page and write down its intended reading order before changing anything. Make a grayscale copy, blur it slightly, or view it as a small thumbnail; these checks reduce the pull of color and detail and make the largest shapes easier to compare. If the wrong item dominates, change one variable at a time—size, position, weight, or spacing—and compare the result. The aim is not to follow a fixed formula, but to make the information easier for the intended audience to use.',
      },
      {
        type: 'p',
        text: 'Visual hierarchy improves when it is tested against a real message and real viewing conditions. Clear priorities, readable type, deliberate contrast, and consistent spacing give a design structure. The final check is simple: can the intended reader find what they need and understand what to do next?',
      },
    ],
  },
];
