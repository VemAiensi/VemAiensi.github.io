package guiCompiler;

import java.awt.EventQueue;

import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.JScrollPane;

import java.awt.Color;
import javax.swing.JButton;
import java.awt.Font;
import java.awt.event.ActionListener;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.awt.event.ActionEvent;
import javax.swing.JTextArea;
import javax.swing.filechooser.FileNameExtensionFilter;
import javax.swing.JEditorPane;
import javax.swing.JFileChooser;
import javax.swing.JLabel;
import javax.swing.JScrollBar;

import java.util.regex.*;
import java.util.*;
import java.awt.Toolkit;

public class GUI 
{
	String contents = "none";
	List<String> tokens = new ArrayList<String>(); ;
	List<String> fileContents = new ArrayList<String>(); 

	private JFrame frame;

	/**
	 * Launch the application.
	 */
	public static void main(String[] args) 
	{
		EventQueue.invokeLater(new Runnable() 
		{
			public void run() 
			{
				try 
				{
					GUI window = new GUI();
					window.frame.setVisible(true);
				} 
				catch (Exception e) 
				{
					e.printStackTrace();
				}
			}
		});
	}

	/**
	 * Create the application.
	 */
	public GUI() 
	{
		initialize();
	}

	/**
	 * Initialize the contents of the frame.
	 */
	private void initialize() 
	{
		frame = new JFrame();
		frame.setResizable(false);
		frame.setIconImage(Toolkit.getDefaultToolkit().getImage(GUI.class.getResource("/guiCompiler/TURTLE.ico")));
		JPanel panel = new JPanel();
		JButton btnNewButton = new JButton("Open File");
		JButton btnNewButton2 = new JButton("Lexical Analysis");
		JButton btnNewButton3 = new JButton("Syntax Analysis");
		JButton btnNewButton4 = new JButton("Semantic Analysis");
		JButton btnNewButton5 = new JButton("Clear");
		JScrollPane scrollPane_1 = new JScrollPane();
		JEditorPane dtrpnWaitingForFile = new JEditorPane();
		
		//frame
		frame.getContentPane().setBackground(new Color(255, 240, 157));
		frame.setBounds(100, 100, 827, 501);
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		frame.getContentPane().setLayout(null);
		
		//header
		panel.setBackground(new Color(105, 165, 46));
		panel.setBounds(-73, 0, 1000, 70);
		frame.getContentPane().add(panel);
		panel.setLayout(null);
		
		JLabel lblNewLabel_1 = new JLabel("The TurtleDuck Simple Compiler");
		lblNewLabel_1.setFont(new Font("Tahoma", Font.PLAIN, 20));
		lblNewLabel_1.setForeground(new Color(255, 255, 255));
		lblNewLabel_1.setBounds(92, 22, 294, 26);
		panel.add(lblNewLabel_1);
		
		JLabel lblNewLabel_1_1 = new JLabel("by Marianne Edic and Vem Aiensi Marasigan");
		lblNewLabel_1_1.setForeground(Color.WHITE);
		lblNewLabel_1_1.setFont(new Font("Tahoma", Font.PLAIN, 12));
		lblNewLabel_1_1.setBounds(390, 22, 294, 26);
		panel.add(lblNewLabel_1_1);
		
		JScrollPane scrollPane = new JScrollPane();
		scrollPane.setBounds(213, 155, 567, 276);
		frame.getContentPane().add(scrollPane);
		JTextArea textArea = new JTextArea();
		scrollPane.setViewportView(textArea);
		
		//file contents area
		textArea.setEditable(false);
		textArea.setLineWrap(true);
		textArea.setFont(new Font("Monospaced", Font.PLAIN, 15));

		
		//open file button
		btnNewButton.addActionListener(new ActionListener() 
		{
			public void actionPerformed(ActionEvent e) 
			{
				fileContents = openFileExplorer();
				
				contents = convertListToString(fileContents);
				
				if (!fileContents.isEmpty())
				{
					textArea.setText(contents);
					btnNewButton.setEnabled(false);
					btnNewButton2.setEnabled(true);
					btnNewButton3.setEnabled(false);
					btnNewButton4.setEnabled(false);
					btnNewButton5.setEnabled(true);
					textArea.setText(contents);
					dtrpnWaitingForFile.setText("Ready for analysis!");
				}
			}
		});
		btnNewButton.setFont(new Font("Tahoma", Font.PLAIN, 15));
		btnNewButton.setBounds(27, 93, 136, 47);
		frame.getContentPane().add(btnNewButton);
		
		
		//lexical analysis button
		btnNewButton2.setEnabled(false);
		btnNewButton2.addActionListener(new ActionListener() 
		{
			public void actionPerformed(ActionEvent e) 
			{
				tokens = lexemeAnalysis(fileContents);
				if (!tokens.isEmpty())
				{
					btnNewButton.setEnabled(false);
					btnNewButton2.setEnabled(false);
					btnNewButton3.setEnabled(true);
					btnNewButton4.setEnabled(false);
					btnNewButton5.setEnabled(true);
		            StringBuilder combinedTokens = new StringBuilder();
					for (String tokenPer : tokens)
					{
						combinedTokens.append(tokenPer).append("\n");
					}
					dtrpnWaitingForFile.setText(combinedTokens.toString());
				}
			}
		});
		btnNewButton2.setFont(new Font("Tahoma", Font.PLAIN, 13));
		btnNewButton2.setBounds(27, 167, 136, 47);
		frame.getContentPane().add(btnNewButton2);
		
		
		//syntax analysis button
		btnNewButton3.setEnabled(false);
		btnNewButton3.setFont(new Font("Tahoma", Font.PLAIN, 13));
		btnNewButton3.setBounds(27, 243, 136, 47);
		frame.getContentPane().add(btnNewButton3);
		btnNewButton3.addActionListener(new ActionListener() 
		{
			public void actionPerformed(ActionEvent e) 
			{
				boolean valid= syntaxAnalysis(tokens);
				if (valid)
				{
					btnNewButton.setEnabled(false);
					btnNewButton2.setEnabled(false);
					btnNewButton3.setEnabled(false);
					btnNewButton4.setEnabled(true);
					btnNewButton5.setEnabled(true);
					dtrpnWaitingForFile.setText("Valid syntax!");
				}
				else
				{
					btnNewButton.setEnabled(false);
					btnNewButton2.setEnabled(false);
					btnNewButton3.setEnabled(false);
					btnNewButton4.setEnabled(false);
					btnNewButton5.setEnabled(true);
					dtrpnWaitingForFile.setText("Invalid syntax!");
				}
			}
		});
		
		
		//semantic analysis button
		btnNewButton4.setEnabled(false);
		btnNewButton4.setFont(new Font("Tahoma", Font.PLAIN, 13));
		btnNewButton4.setBounds(27, 313, 136, 47);
		frame.getContentPane().add(btnNewButton4);
		btnNewButton4.addActionListener(new ActionListener() 
		{
			public void actionPerformed(ActionEvent e) 
			{
				String validity = semanticAnalysis(fileContents);
				btnNewButton.setEnabled(false);
				btnNewButton2.setEnabled(false);
				btnNewButton3.setEnabled(false);
				btnNewButton4.setEnabled(false);
				btnNewButton5.setEnabled(true);
				dtrpnWaitingForFile.setText(validity);
			}			
		});
	
		
		//clear button
		btnNewButton5.setEnabled(false);
		btnNewButton5.setFont(new Font("Tahoma", Font.PLAIN, 15));
		btnNewButton5.setBounds(27, 382, 136, 47);
		frame.getContentPane().add(btnNewButton5);
		btnNewButton5.addActionListener(new ActionListener() 
		{
			public void actionPerformed(ActionEvent e) 
			{
				 textArea.setText("");
				 dtrpnWaitingForFile.setText("");
				 btnNewButton.setEnabled(true);
				 btnNewButton2.setEnabled(false);
				 btnNewButton3.setEnabled(false);
				 btnNewButton4.setEnabled(false);
				 btnNewButton5.setEnabled(false);
				 contents = "none";
				 tokens = new ArrayList<String>(); ;
				 fileContents = new ArrayList<String>(); 
				 
			}
		});
		

		scrollPane_1.setBounds(260, 93, 520, 47);
		frame.getContentPane().add(scrollPane_1);

		scrollPane_1.setViewportView(dtrpnWaitingForFile);
		dtrpnWaitingForFile.setEditable(false);
		dtrpnWaitingForFile.setText("Waiting for file...");
		
		
		//result area
		dtrpnWaitingForFile.setFont(new Font("Tahoma", Font.PLAIN, 14));
		
		JLabel lblNewLabel = new JLabel("Result:");
		lblNewLabel.setFont(new Font("Tahoma", Font.PLAIN, 25));
		lblNewLabel.setBounds(183, 96, 112, 33);
		frame.getContentPane().add(lblNewLabel);
		
		JScrollBar scrollBar = new JScrollBar();
		scrollBar.setBounds(763, 382, 17, 48);
		frame.getContentPane().add(scrollBar);
	}

	public List<String> openFileExplorer() 
	{
		JFileChooser fileChooser = new JFileChooser();
		FileNameExtensionFilter filter = new FileNameExtensionFilter("Java and Text Files", "java", "txt");
        fileChooser.setFileFilter(filter);
        int result = fileChooser.showOpenDialog(frame);

        if (result == JFileChooser.APPROVE_OPTION) 
        {
            File selectedFile = fileChooser.getSelectedFile();
            
            // Read and display the contents of the file
            fileContents = displayFileContents(selectedFile);
        }
        return fileContents;
		
	}
    private List<String> displayFileContents(File file) 
    {
        try 
        {
            // FileReader reads text files in the default encoding.
            FileReader fileReader = new FileReader(file);

            // Wrap FileReader in BufferedReader.
            BufferedReader bufferedReader = new BufferedReader(fileReader);

            // Read the file line by line and display the contents.
            String line;
            while ((line = bufferedReader.readLine()) != null) 
            {
            	fileContents.add(line);
            }

            contents = fileContents.toString();
            
            // Close the BufferedReader.
            bufferedReader.close();
            

        } 
        catch (IOException e) 
        {
            e.printStackTrace();
            
        }
        return fileContents;
    }
    
    private String convertListToString(List<String> list) 
    {
        // Join the list elements with a newline character.
        return String.join("\n", list);
    }
    
    public List<String> lexemeAnalysis(List<String> inputStatement)
    {
        String[] dataTypes = {"int", "double", "char", "String", "boolean"};
        String[] symbols = {"="};
        String[] delimiter = {";"};
        String[] bools = {"true", "false"};

        String identifierPattern = "[a-zA-Z_][a-zA-Z0-9_]*";
        String valuePattern = "\"(?:[^\"\\\\]|\\\\.)*\"|'[^']*'|\\d+(\\.\\d+)?";
        Pattern stringLiteralPattern = Pattern.compile("\"[^\"]*\"");
        
        List<String> output = new ArrayList<>();

        Pattern pattern = Pattern.compile("(" + identifierPattern + "|" + valuePattern + "|.)");
        
        for (String statement : inputStatement) 
        {
            Matcher matcher = pattern.matcher(statement);
            StringBuilder statementOutput = new StringBuilder("");
	        while (matcher.find()) 
	        {
	            String lexeme = matcher.group();
	            if (isInArray(lexeme, dataTypes)) 
	            {
	                statementOutput.append("<data_type> ");
	            }
	            else if (isInArray(lexeme, symbols)) 
	            {
	                statementOutput.append("<assignment_operator> ");
	            }
	            else if (isInArray(lexeme, bools))
	            {
	            	statementOutput.append("<value> ");
	            }
	            else if (lexeme.matches(identifierPattern)) 
	            {
	            	statementOutput.append("<identifier> ");
	            }
	            else if (stringLiteralPattern.matcher(lexeme).matches()) 
	            {
	            	statementOutput.append("<value> ");
	            }
	            else if (lexeme.matches(valuePattern)) 
	            {
	            	statementOutput.append("<value> ");
	            }
	            else if (isInArray(lexeme, delimiter)) 
	            {
	            	statementOutput.append("<delimiter> ");
	            }
	        }
	        output.add(statementOutput.toString().trim());
        }

		return output;
    }

    private static boolean isInArray(String target, String[] array) 
    {
        for (String item : array) 
        {
            if (item.equals(target)) 
            {
                return true;
            }
        }
        return false;
    }

    public boolean syntaxAnalysis(List<String> toCheck) 
    {
        String expected = "<data_type> <identifier> <assignment_operator> <value> <delimiter>";

        for (String line : toCheck) 
        {
            if (!line.trim().equals(expected)) 
            {
                return false;
            }
        }

        return true;
    }
    
    public String semanticAnalysis(List<String> lines) 
    {
        boolean allCorrect = true;

        for (String line : lines) 
        {
            String status = semanticAnalysisSingleLine(line);
            if (!status.equals("Semantically correct!")) 
            {
                allCorrect = false;
                break;  // Stop processing further lines if an error is encountered
            }
        }

        return allCorrect ? "Semantically correct!" : "Semantically incorrect!";
    }
    
    public String semanticAnalysisSingleLine(String line) 
    {
        String status;
        line = line.trim();

        if (!line.endsWith(";")) 
        {
            status = "Invalid input! Missing semicolon.";
            return status;
        }

        line = line.substring(0, line.length() - 1);

        String[] lineParts = line.split("=");

        if (lineParts.length != 2) 
        {
            status = "Invalid input! Line error.";
            return status;
        }

        String declaration = lineParts[0].trim();
        String value = lineParts[1].trim();

        String[] declarationParts = declaration.split(" ");

        if (declarationParts.length != 2) 
        {
            status = "Invalid input! Declaration error.";
            return status;
        }

        String dataType = declarationParts[0];

        if (dataType.equals("int")) 
        {
            try 
            {
                Integer.parseInt(value);
                status = "Semantically correct!";
            } 
            catch (NumberFormatException e) 
            {
                status = "Semantically incorrect!";
            }
        } 
        else if (dataType.equals("double")) 
        {
            try 
            {
                Double.parseDouble(value);
                status = "Semantically correct!";
            } 
            catch (NumberFormatException e) 
            {
                status = "Semantically incorrect!";
            }
        } 
        else if (dataType.equals("String")) 
        {
            if (value.startsWith("\"") && value.endsWith("\"")) 
            {
                status = "Semantically correct!";
            } 
            else 
            {
                status = "Semantically incorrect!";
            }
        } 
        else if (dataType.equals("boolean")) 
        {
            if (value.equals("true") || value.equals("false")) 
            {
                status = "Semantically correct!";
            } 
            else 
            {
                status = "Semantically incorrect!";
            }
        } 
        else if (dataType.equals("char")) 
        {
            if ((value.startsWith("\'")  && value.endsWith("\'")) && value.length() == 3)
            {
                status = "Semantically correct!";
            } 
            else 
            {
                status = "Semantically incorrect!";
            }
        } 
        else 
        {
            status = "Invalid input!";
        }

        return status;
    }
}
