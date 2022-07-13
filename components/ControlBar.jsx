import PropTypes from "prop-types"
import styles from "../styles/Control.module.css"
import {Button, Dropdown, DropdownOption, DropdownOptions, Icon} from "@f-ui/core"
import React, {useContext, useMemo} from "react"
import Search from "../../../../components/search/Search"
import AsyncFS from "../../../utils/AsyncFS"
import FileSystem from "../../../utils/files/FileSystem"
import FILE_TYPES from "../../../../../public/static/FILE_TYPES"
import importFile from "../utils/importFile"
import EngineProvider from "../../../providers/EngineProvider"
import selection from "../utils/selection"
import SELECTION_TYPES from "../SELECTION_TYPES"

export default function ControlBar(props) {
    const {
        searchString,
        setSearchString,
        hook,
        hidden,
        view, setView
    } = props
    const starred = useMemo(() => hook.bookmarks.find(b => b.path === hook.currentDirectory.id) !== undefined, [hook.currentDirectory, hook.bookmarks])
    const [engine] = useContext(EngineProvider)

    return (
        <div className={styles.wrapper} style={{border: hidden ? "none" : undefined}}>
            {view.navigation ?
                <div className={styles.buttonGroup} style={{width: "100%"}}>
                    <div className={styles.buttonGroup}>
                        <Button
                            className={styles.settingsButton}
                            onClick={() => hook.returnDir()}
                        >
                            <Icon>arrow_back</Icon>
                        </Button>
                        <Button
                            className={styles.settingsButton}
                            onClick={() => hook.forwardDir()}
                        >
                            <Icon styles={{transform: "rotate(180deg)"}}>arrow_back</Icon>
                        </Button>
                        <Button
                            className={styles.settingsButton}
                            disabled={hook.currentDirectory.id === FileSystem.sep}
                            onClick={hook.goToParent}
                        >
                            <Icon
                                styles={{transform: "rotate(180deg)"}}>subdirectory_arrow_right</Icon>
                        </Button>
                        <Button
                            disabled={hook.loading}
                            className={styles.settingsButton}
                            onClick={() => {
                                alert.pushAlert("Refreshing files", "info")
                                hook.refreshFiles().catch()
                            }}
                        >
                            <Icon>sync</Icon>
                        </Button>
                        <Button
                            styles={{border: "none"}}
                            className={styles.settingsButton}
                            onClick={async () => {
                                let path = hook.currentDirectory.id + FileSystem.sep + "New folder"

                                const existing = window.fileSystem.foldersFromDirectory(hook.path + hook.currentDirectory.id)
                                if (existing.length > 0)
                                    path += " - " + existing.length
                                await AsyncFS.mkdir(hook.path + path, {})
                                hook.refreshFiles().catch()
                            }}

                        >
                            <Icon styles={{transform: "rotate(180deg)"}}>create_new_folder</Icon>
                        </Button>
                        <Button
                            className={styles.settingsButton}
                            variant={starred ? "filled" : undefined}
                            styles={{border: "none"}}
                            onClick={() => {
                                if (starred)
                                    hook.removeBookmark(hook.currentDirectory.id)
                                else
                                    hook.addBookmark(hook.currentDirectory.id)
                            }}
                        >
                            <Icon>star</Icon>
                        </Button>
                        <Dropdown
                            disabled={hook.loading} hideArrow={true}
                            className={styles.settingsButton}
                            styles={{border: "none"}}
                            onClick={() => {
                                hook.refreshFiles().catch()
                            }}
                            variant={props.fileType !== undefined ? "filled" : undefined}
                        >
                            <Icon>filter_alt</Icon>
                            <DropdownOptions>
                                {Object.keys(FILE_TYPES).map((k, i) => (
                                    <React.Fragment key={k + "-filter-key-" + i}>
                                        <DropdownOption
                                            option={{
                                                label: k.toLowerCase().replace("_", " "),
                                                icon: props.fileType === FILE_TYPES[k] ? <Icon>check</Icon> : undefined,
                                                onClick: () => props.setFileType(props.fileType === FILE_TYPES[k] ? undefined : FILE_TYPES[k]),
                                                keepAlive: false,
                                            }}
                                            className={styles.fileType}
                                        />
                                    </React.Fragment>
                                ))}
                            </DropdownOptions>
                        </Dropdown>
                    </div>

                    <Search
                        width={"100%"}
                        searchString={hook.currentDirectory.id}
                        noIcon={true}
                        noPlaceHolder={true}
                        noAutoSubmit={true}
                        setSearchString={async (path) => {
                            if (await AsyncFS.exists(hook.path + path))
                                hook.setCurrentDirectory({
                                    id: path
                                })
                        }}
                    />
                    <Search
                        searchString={searchString}
                        height={"30px"}
                        setSearchString={setSearchString}
                        width={"25%"}
                    />


                </div>
                :
                null
            }

            <div className={styles.buttonGroup} style={{justifyContent: "flex-end"}}>
                <Dropdown className={styles.dropdown} hideArrow={true} variant={"outlined"}>
					View
                    <DropdownOptions>
                        <DropdownOption
                            option={{
                                label: "Navigation options",
                                icon: view.navigation ? <Icon styles={{fontSize: "1.1rem"}}>check</Icon> : null,
                                onClick: () => setView({...view, navigation: !view.navigation})
                            }}
                        />
                        <DropdownOption
                            option={{
                                label: "Side bar",
                                icon: view.sideBar ? <Icon styles={{fontSize: "1.1rem"}}>check</Icon> : null,
                                onClick: () => setView({...view, sideBar: !view.sideBar})
                            }}
                        />
                    </DropdownOptions>
                </Dropdown>
                <Dropdown className={styles.dropdown} hideArrow={true} variant={"outlined"}>
					Select
                    <DropdownOptions>
                        <DropdownOption
                            option={{
                                label: "All",
                                onClick: () => selection(SELECTION_TYPES.ALL, hook, props.setSelected, props.selected),
                                shortcut: "A"
                            }}
                        />
                        <DropdownOption
                            option={{
                                label: "None",
                                onClick: () => selection(SELECTION_TYPES.NONE, hook, props.setSelected, props.selected),
                                shortcut: "Alt + A"
                            }}
                        />
                        <DropdownOption
                            option={{
                                label: "Invert",
                                onClick: () => selection(SELECTION_TYPES.INVERT, hook, props.setSelected, props.selected),
                                shortcut: "Ctrl + i"
                            }}/>
                    </DropdownOptions>
                </Dropdown>
                <div className={styles.divider}/>
                <Button
                    styles={{width: "75px", gap: "4px", padding: "0 16px"}}
                    className={styles.settingsButton}
                    onClick={() => importFile(engine, props.hook)}
                >
                    <Icon styles={{fontSize: "1rem"}}>open_in_new</Icon>
					Import
                </Button>
            </div>
        </div>
    )
}

ControlBar.propTypes = {
    setSelected: PropTypes.func,
    selected: PropTypes.array,

    view: PropTypes.object,
    setView: PropTypes.func,

    fileType: PropTypes.string,
    setFileType: PropTypes.func,

    searchString: PropTypes.string,
    setSearchString: PropTypes.func,
    path: PropTypes.arrayOf(PropTypes.object),
    hook: PropTypes.object.isRequired,
    hidden: PropTypes.bool
}
