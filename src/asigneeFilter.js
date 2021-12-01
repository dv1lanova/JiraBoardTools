import { h } from 'dom-chef';
import $ from 'jquery';
import uniqBy from 'lodash/uniqBy';

const CONSOLE_PREFIX = '[ASSIGNEE_FILTER]';

const logger = {
  log: (...args) => console.log(CONSOLE_PREFIX, ...args),
  info: (...args) => console.info(CONSOLE_PREFIX, ...args),
  warn: (...args) => console.warn(CONSOLE_PREFIX, ...args),
  error: (...args) => console.error(CONSOLE_PREFIX, ...args),
};

let observers = [];
let currentAssignee = null;

const filterToAssignee = async (name) => {
  currentAssignee = name;
  logger.info({ currentAssignee });

  // clear highlights
  $('.assignee-avatar').removeClass('highlight');
  $('.ghx-avatar-img').removeClass('highlight');

  // disconnect previous mutation observers
  observers.map((o) => o.disconnect());
  observers = [];

  if (currentAssignee) {
    // reset filter on .ghx-column subtree modifications changes
    $('.ghx-column').each((_, e) => {
      const observer = new MutationObserver(() => {
        filterToAssignee(currentAssignee);
      });
      observer.observe(e, { childList: true, subtree: true });
      observers.push(observer);
    });

    // hide all cards
    $('.ghx-issue').hide();

    // show only ones with correct assignee
    $(`[data-tooltip="Assignee: ${currentAssignee}"]`).each((_, el) =>
      $(el)
        .closest('.ghx-issue')
        .show(),
    );

    // highlight filter
    $(`.assignee-avatar[data-name="${name}"]`).addClass('highlight');
    $(`.ghx-avatar-img[data-tooltip="Assignee: ${currentAssignee}"]`).addClass('highlight');
    
  } else {
    console.log('clear filter');
    // clear filter
    $('.ghx-issue').show();
  }
};

const renderFilter = (assignees) => {
  return (
    <ul id="assignee-filter">
      {assignees.map(({ name, img, type, content }) => (
        <li
          className="item"
          onClick={() => (currentAssignee === name ? filterToAssignee(null) : filterToAssignee(name))}
        >
          {type === 'img' ? (
          <div className="assignee-avatar" data-name={name} >
            <img alt={name} title={name} src={img} /> 
          </div>) : 
          (<div className="ghx-avatar" data-name={name}>
            <span class="ghx-avatar-img ghx-auto-avatar" style={ {backgroundColor: '#815b3a'}} data-tooltip={`Assignee: ${name}`}>{content}</span>
          </div>)}
        </li>
      ))}
    </ul>
  );
};

const getAllVisibleAssignees = () => {
  logger.info('Getting all assignees...');
  const avatars = [];
  ['.ghx-avatar img', '.ghx-avatar span'].forEach(
    selector => {
      const type = selector.split(' ')[1]
      $(selector).each((_, el) => {
        const img = $(el).attr('src');
        const name = $(el)
          .attr('data-tooltip')
          .split(': ')[1];
        const content = $(el).text()
        const avatar = {
          name,
          img,
          content,
          type
        };
        avatars.push(avatar);
      });
    }
  )
  const assignees = uniqBy(avatars, 'name');
  logger.info(assignees);
  return assignees;
};

const render = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const assignees = getAllVisibleAssignees();
  const randomAssignees = assignees.sort(() => (Math.random() > .5) ? 1 : -1);
  const assigneeFilter = renderFilter(randomAssignees);
  $('#ghx-header').append(assigneeFilter);
};

export default render
