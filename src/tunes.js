import { make } from './ui';
import bgIcon from './svg/background.svg';
import borderIcon from './svg/border.svg';
import stretchedIcon from './svg/stretched.svg';
import leftImageIcon from './svg/left-image.svg';
import rightImageIcon from './svg/right-image.svg';
import centerImageIcon from './svg/center-image.svg';

/**
 * Working with Block Tunes
 */
export default class Tunes {
  /**
   * @param {object} tune - image tool Tunes managers
   * @param {object} tune.api - Editor API
   * @param {object} tune.actions - list of user defined tunes
   * @param {Function} tune.onChange - tune toggling callback
   */
  constructor({ api, actions, onChange }) {
    this.api = api;
    this.actions = actions;
    this.onChange = onChange;
    this.buttons = [];
  }

  /**
   * Available Image tunes
   *
   * @returns {{name: string, icon: string, title: string}[]}
   */
  static get tunes() {
    return [
      {
        name: 'withBorder',
        icon: borderIcon,
        title: 'With border',
      },
      {
        name: 'stretched',
        icon: stretchedIcon,
        title: 'Stretch image',
      },
      {
        name: 'withBackground',
        icon: bgIcon,
        title: 'With background',
      },
      {
        name: 'leftImage',
        icon: leftImageIcon,
        title: 'Imagem a esquerda',
      },
      {
        name: 'rightImage',
        icon: rightImageIcon,
        title: 'Imagem a direita',
      },
      {
        name: 'centerImage',
        icon: centerImageIcon,
        title: 'Imagem no centro',
      },
    ];
  }

  /**
   * Styles
   *
   * @returns {{wrapper: string, buttonBase: *, button: string, buttonActive: *}}
   */
  get CSS() {
    return {
      wrapper: '',
      buttonBase: this.api.styles.settingsButton,
      button: 'image-tool__tune',
      buttonActive: this.api.styles.settingsButtonActive,
    };
  }

  /**
   * Makes buttons with tunes: add background, add border, stretch image
   *
   * @param {ImageToolData} toolData - generate Elements of tunes
   * @returns {Element}
   */
  render(toolData) {
    console.info('created');
    const wrapper = make('div', this.CSS.wrapper);
    const container = document.querySelector('.image-tool');

    if (container) {
      container.style.position = 'initial';
    }

    this.api.listeners.on(container, 'mouseout', () => {
      console.info('out moved');
      if (container.style.position === 'relative') {
        return;
      }
      container.style.position = 'relative';
    }, false);

    this.buttons = [];

    const tunes = Tunes.tunes.concat(this.actions);

    tunes.forEach(tune => {
      const title = this.api.i18n.t(tune.title);
      const el = make('div', [this.CSS.buttonBase, this.CSS.button], {
        innerHTML: tune.icon,
        title,
      });

      el.setAttribute('id', tune.name);

      el.addEventListener('click', () => {
        this.tuneClicked(tune.name, tune.action);

        // const isOPenTool = !!document.querySelector('.ce-toolbar__actions--opened');
        // const container = document.querySelector('.image-tool');

        // if (container) {
        //   container.style.position = isOPenTool ? 'relative' : 'initial';
        // }

        // if (isOPenTool) {
        //   const opened = document.querySelector('.ce-settings');

        //   opened.style.top = 'none !important';
        //   opened.style.bottom = '30px !important';
        //   opened.style.width = '280px !important';
        // }

        const unselect = ['rightImage', 'leftImage', 'centerImage'].filter(value => value !== tune.name);

        unselect.forEach(value => {
          const isSelect = document.getElementById(value).classList.contains(this.CSS.buttonActive);

          if (isSelect) {
            const activeTune = tunes.find(_tune => _tune.name === value);

            this.tuneClicked(activeTune.name, activeTune.action);
          }
        });
      });

      el.dataset.tune = tune.name;
      el.classList.toggle(this.CSS.buttonActive, toolData[tune.name]);

      this.buttons.push(el);

      this.api.tooltip.onHover(el, title, {
        placement: 'top',
      });

      wrapper.appendChild(el);
    });

    return wrapper;
  }

  /**
   * Clicks to one of the tunes
   *
   * @param {string} tuneName - clicked tune name
   * @param {Function} customFunction - function to execute on click
   */
  tuneClicked(tuneName, customFunction) {
    if (typeof customFunction === 'function') {
      if (!customFunction(tuneName)) {
        return false;
      }
    }

    const button = this.buttons.find(el => el.dataset.tune === tuneName);

    button.classList.toggle(this.CSS.buttonActive, !button.classList.contains(this.CSS.buttonActive));

    this.onChange(tuneName);
  }
}
