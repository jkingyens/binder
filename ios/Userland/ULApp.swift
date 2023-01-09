//
//  UserlandApp.swift
//  Userland
//
//  Created by Jeffrey Kingyens on 1/9/23.
//

import Foundation

//defines a userland application
struct ULApp : Codable {

    struct ULAppName : Codable {
        
        let bundle : String;
        let display : String;
        
    }
    
    struct ULModule : Codable {
    
        struct ULVideo : Codable  {
            
            let name : String
            let source : URL
            
        }
        
        let name : String;
        let videos : [ULVideo];
        
    }
    
    let name : ULAppName;
    let author : String;
    let version : String;
    let modules : [ULModule];
    
}
