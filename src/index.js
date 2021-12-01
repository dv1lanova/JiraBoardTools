import $ from 'jquery';

import RenderAsigneeFilter from './asigneeFilter'
import RenderTimer from './timer'

const init = async () => {
  RenderAsigneeFilter()
  RenderTimer()
};

$(window).ready(init);
