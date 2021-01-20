// Based on https://github.com/DefinitelyTyped/DefinitelyTyped/blob/312a1784f71508f2a46fbd3f890feb0b79f17ae0/types/xdomain/index.d.ts#L1
// Moved to global recipe at https://www.typescriptlang.org/docs/handbook/declaration-files/templates/global-d-ts.html

declare namespace xdomain {
    interface IXDomainCookies {
        master: string;
        slave: string;
    }

    export type XDomainSlaves = Record<string, string>

    export type XDomainMasters = Record<string, string>

    /**
     * Will initialize as a master
     *
     * Each of the slaves must be defined as: origin: proxy file
     *
     * The slaves object is used as a list slaves to force one proxy file per origin.
     * @param slaveObj
     */
    function slaves(slaveObj: XDomainSlaves): void

    /**
     * Will initialize as a slave
     *
     * Each of the masters must be defined as: origin: path
     *
     * origin and path are converted to a regular expression by escaping all non-alphanumeric chars, then converting * into .* and finally wrapping it with ^ and $. path can also be a RegExp literal.
     *
     * Requests that do not match both the origin and the path regular expressions will be blocked.
     * @param masterObj
     */
    function masters(masterObj: XDomainMasters): void;

    let origin: string;

    /**
     * When true, XDomain will log actions to console
     */
    let debug: boolean;

    /**
     * Number of milliseconds until XDomains gives up waiting for an iframe to respond
     * @default 15e3ms (15 seconds)
     */
    let timeout: number

    /**
     * event may be log, warn or timeout. When listening for log and warn events, handler with contain the message as
     * the first parameter. The timeout event fires when an iframe exeeds the xdomain.timeout time limit.
     * @param event
     * @param handler
     */
    function on(event: 'log' | 'warn' | 'timeout', handler: (message?: string) => any): void;

    let cookies: IXDomainCookies;
}

interface Window {
    xdomain: typeof xdomain
}