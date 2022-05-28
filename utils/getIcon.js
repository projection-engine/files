import styles from "../styles/Item.module.css";
import Preview from "../../../../components/preview/Preview";
import FILE_TYPES from "../../../../../public/project/glTF/FILE_TYPES";

export default function getIcon({
                                    path,
                                    type,
                                    visualization,
                                    childrenQuantity
                                }) {

    const common = (t) => (
        <div className={styles.icon} data-size={`${visualization}`}>
            <Preview
                iconStyles={{fontSize: '4rem'}}

                path={path} className={styles.image}
                fallbackIcon={t}
            >
                <div title={type === FILE_TYPES.IMAGE ? 'image' : type} className={styles.floatingIconWrapper}
                     style={{display: visualization === 2 ? 'none' : undefined}}>
                    <span className={['material-icons-round', styles.floatingIcon].join(' ')}>{t}</span>
                </div>
            </Preview>
        </div>
    )
    switch (type) {
        case FILE_TYPES.IMAGE:
            return common('image')
        case FILE_TYPES.MATERIAL:
            return common('texture')
        case FILE_TYPES.TERRAIN :
            return common('terrain')
        case FILE_TYPES.MESH:
            return common('view_in_ar')
        case FILE_TYPES.UI:
            return (
                <div className={styles.icon} data-size={`${visualization}`}>
                    <span className={'material-icons-round'}>wysiwyg</span>
                </div>
            )
        case FILE_TYPES.SCRIPT:
            return (
                <div className={styles.icon} data-size={`${visualization}`}>
                    <span className={'material-icons-round'}>code</span>
                </div>
            )
        case FILE_TYPES.RAW_SCRIPT:
            return (
                <div className={styles.icon} data-size={`${visualization}`}>
                    <span className={'material-icons-round'}>javascript</span>
                </div>
            )


        case FILE_TYPES.SCENE:
            return (
                <div className={styles.icon} data-size={`${visualization}`}>
                    <span className={'material-icons-round'}>inventory_2</span>
                </div>
            )
        case 'folder': {
            return (
                <div className={styles.icon} data-size={`${visualization}`}>
                    <span className={'material-icons-round'}>{childrenQuantity > 0 ? 'source' : 'folder_open'}</span>
                </div>
            )
        }
        default:
            return (
                <div className={styles.icon} data-size={`${visualization}`}>
                    <span className={'material-icons-round'}>description</span>
                </div>
            )
    }
}
