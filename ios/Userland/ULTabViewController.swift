//
//  UserlandTabViewController.swift
//  Userland
//
//  Created by Jeffrey Kingyens on 1/9/23.
//

import Foundation
import UIKit

class ULTabViewController : UITabBarController {
    
    override func loadView() {


        super.loadView()
        
        // let view = UIView()
        // view.backgroundColor = .lightGray
        // self.view = view
        
        let floatingButton = UIButton()
        floatingButton.setTitle("Add", for: .normal)
        floatingButton.backgroundColor = .gray
        floatingButton.layer.cornerRadius = 25
        
        view.addSubview(floatingButton)
        floatingButton.translatesAutoresizingMaskIntoConstraints = false
        
        floatingButton.widthAnchor.constraint(equalToConstant: 50).isActive = true
        floatingButton.heightAnchor.constraint(equalToConstant: 50).isActive = true
        
        floatingButton.topAnchor.constraint(equalTo: self.view.layoutMarginsGuide.topAnchor, constant: 30).isActive = true
        
        floatingButton.trailingAnchor.constraint(equalTo: self.view.trailingAnchor, constant: -30).isActive = true
        //floatingButton.centerXAnchor.constraint(equalTo: self.view.centerXAnchor).isActive = true
        
        floatingButton.addTarget(self, action: #selector(addURL), for: .touchUpInside)

    }
 
    // add course to library from URL
    @objc func addURL() {
        
        var textField: UITextField?

        // create alertController
        let alertController = UIAlertController(title: "Add Course", message: "Enter URL", preferredStyle: .alert)
          alertController.addTextField { (pTextField) in
          pTextField.placeholder = "https://link.to/userland.json"
          pTextField.clearButtonMode = .whileEditing
          pTextField.borderStyle = .none
          textField = pTextField
        }

        // create cancel button
        alertController.addAction(UIAlertAction(title: "Cancel", style: .cancel, handler: { (pAction) in
          alertController.dismiss(animated: true, completion: nil)
        }))

        // create Ok button
        alertController.addAction(UIAlertAction(title: "Add", style: .default, handler: { (pAction) in
            
            
            // when user taps OK, you get your value here
            let inputValue = textField?.text
                
            // fetch the course from the URL
            // add it to our local database and tell the library view controller to reload?
            // or send this url to the lirary view controller so it can add and reload it?
            if let url = URL(string: inputValue!) {
               // the url
            
               URLSession.shared.dataTask(with: url) { data, response, error in
                  if let data = data {
                     if let jsonString = String(data: data, encoding: .utf8) {
                        print(jsonString)
                        // can i encode this
                         
                         let decoder = JSONDecoder()
                         do {
                             let app = try decoder.decode(ULApp.self, from: Data(jsonString.utf8))
                             print(app)
                         } catch {
                             print(error.localizedDescription)
                         }
                     }
                   }
               }.resume()
            }

            alertController.dismiss(animated: true, completion: nil)
       
        }))

        // show alert controller
        self.present(alertController, animated: true, completion: nil)
        
    }
}
