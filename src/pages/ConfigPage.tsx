import { CSSProperties, useState } from "react";
import ConfigDialog from "../components/ConfigDialog";
import { AppConfig, useAppConfig } from "../scripts/config";
import { rebuildDatabase } from "../scripts/filesystem";
import { notEmpty, Rule, websocketURL } from "../scripts/rules";

const cardStyle: CSSProperties = {
  backgroundColor: "#303030",
  borderRadius: "5px",
};

interface ConfigSection {
  title: string;
  items: ConfigItem[];
}

interface ConfigItem {
  title: string;
  subTitle?: string;
  icon: string;
  onClick?: () => void;
}

export interface SettingProps {}

export default function ConfigPage(props: SettingProps) {
  const [tempConfig, setConfig] = useAppConfig();
  const [configDialogVis, setConfigDialogVis] = useState(false);
  const [configDialogTitle, setConfigDialogTitle] = useState("");
  const [defaultValue, setDefaultValue] = useState("");
  const [rules, setRules] = useState<Rule[]>();
  const [onOK, setOnOK] = useState<any>();

  if (!tempConfig) return null;

  const config = tempConfig as AppConfig;

  const sections: ConfigSection[] = [
    {
      title: "Profile",
      items: [
        {
          title: "Identity",
          subTitle: config.userID,
          icon: "person",
        },
      ],
    },
    {
      title: "IPFS",
      items: [
        {
          title: "Binary path",
          subTitle: config.IPFSPath,
          icon: "notes",
          onClick: () => console.log(233),
        },
        {
          title: "IPFS config",
          icon: "settings",
        },
      ],
    },
    {
      title: "Gateway",
      items: [
        {
          title: "Address",
          subTitle: config.gatewayURL,
          icon: "link",
          onClick: () => {
            setConfigDialogVis(true);
            setRules([notEmpty, websocketURL]);
            setConfigDialogTitle("Gateway Address");
            setDefaultValue(config.gatewayURL);
            setOnOK(() => {
              return (value: string) => {
                setConfig({ gatewayURL: value });
                setConfigDialogVis(false)
                rebuildDatabase()
              };
            });
          },
        },
      ],
    },
  ];

  const configItem = (item: ConfigItem) => {
    return (
      <li
        key={item.title}
        style={{ borderRadius: "5px" }}
        className="mdui-list-item mdui-ripple"
        onClick={item.onClick}
      >
        <i style={{ width: 24 }} className="material-icons">
          {item.icon}
        </i>
        <div className="mdui-list-item-content">
          <div className="mdui-list-item-title">{item.title}</div>
          <div className="mdui-list-item-text mdui-list-item-one-line">
            {item.subTitle}
          </div>
        </div>
        <i className="mdui-icon material-icons">keyboard_arrow_right</i>
      </li>
    );
  };

  return (
    <>
      <ConfigDialog
        style={{ width: 500 }}
        rules={rules}
        visible={configDialogVis}
        onOk={onOK}
        onClose={() => setConfigDialogVis(false)}
        title={configDialogTitle}
        defaultValue={defaultValue}
      ></ConfigDialog>

      <div className="mdui-container-fluid mdui-typo">
        <div
          className="mdui-row"
          style={{ justifyContent: "center", display: "flex" }}
        >
          <div className="mdui-col-xs-10 mdui-col-md-6 .mdui-col-lg-4">
            {sections.map((section) => (
              <div key={section.title}>
                <h4>{section.title}</h4>
                <div style={cardStyle} className="mdui-shadow-5">
                  <ul className="mdui-list mdui-list-dense">
                    {section.items.map((item, index) => (
                      <div key={item.title}>
                        {index !== 0 && <div className="mdui-divider"></div>}
                        {configItem(item)}
                      </div>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
