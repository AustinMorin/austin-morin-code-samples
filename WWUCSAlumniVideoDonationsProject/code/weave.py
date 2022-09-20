# To run Program on lab computers:
# python3 weave.py ./donor-files/<FILENAME>
# or replace the argument with the path or relative path to the files

import csv
from email.mime import audio
import sys
import time
import uuid
import pickle
import os
import random
import storage_access
import string
import textwrap
import pandas as pd
import concurrent.futures as cf
from moviepy.editor import *
from moviepy.video import *
from moviepy.audio import fx as audiofx
from datetime import datetime
from pathlib import Path # to build paths that work on all operating systems.
import textwrap
from PIL import Image, ImageDraw, ImageFont # PILLOW

####################################### Init Vars #######################################

# main function unable to see these. Must use global within the function when referencing
# so it knows to look out here.

lastName = "Squarepants"
firstName = "Spongebob"
gradYear = 2022

# Paths
cwd = Path.cwd()
resPath = cwd / "res"
qrPath = resPath / "ad_alt1.png"
musicPath = resPath / "CornDogsInSantaMonica_5min.mp3"
indexesPath = resPath / "indexes.txt"
weaveTEMP = cwd / storage_access.getWeaveTEMP()

# Extentions and URL
websiteURL = "https://wwucsgiving.web.app/?name="
csvFile = ".csv"
xlsxFile = ".xlsx"
outputExtension = "_OUTPUT"

# Indexes of info in donor file
firstNameIndex = 0
lastNameIndex = 1
gradYearIndex = 2

# For textToVideo + video making
videosDir = cwd
background = Image.open(resPath / 'background.png').copy()
#fontName = 'Kinnari.ttf'
textColor = 'rgb(255,255,255)' #white
fontName =  resPath / 'FiraSans-Regular.ttf'
fontSize = 60
vidWidth = 1280
vidHeight = 720
videosFound = 0
contentList = []
editedContentList = []

# Misc.
curYear = datetime.now().year
maxWorkers = 4 #12 # Lab machines are suggested to do 4

# Should be unecessary as videos are chosen by grad year on FB
# curdir = input(["Enter directory of video clips (Format: FOLDER_NAME\SECOND_FOLDER_NAME\ETC). Hit enter if they are within the current directory"])
# using a commandline argument for easier testing
# unformatedDonors = input(["Enter the path of the donors CSV (Format: FOLDER_NAME\FILE_NAME). Enter name if it is within the current directory"])

####################################### Finished Functions #######################################

# Takes in a directory and adds videos from that directory to contentList
# Thoughts: For each dir (chapter), in the given dir, pull out only how many videos we need
# from each chapter (randomly except for the name chapter), then weave them in order. Then go onto
# the next person.
# def getVideosFromDir(): # Just for testing
#    for chapter in os.listdir(curdir):
#        chapter = chapter
#        print(chapter)
#
#        # Remind the program that video files are not folders. Silly program!
#        if ('.mp4' in chapter) or ('.MOV' in chapter):
#            chapter = ""
#
#        videosInDir = os.listdir(curdir)
#
#        if len(videosInDir) == 0:
#            print('no videos found in ' + chapter)
#        else:
#           video = random.choice(videosInDir)
#            if (video.endswith('.MOV') or video.endswith('mp4')):
#                contentList.append(video)
#                print("Adding " + video + " to contentList")
#################################### End of Function ####################################

def wrapText(text):
    text = "\n".join(textwrap.wrap(text, width=35))
    lines = text.split("\n")
    return lines
#################################### End of Function ####################################

def addText(background, text):
    draw = ImageDraw.Draw(background)
    font = ImageFont.truetype(str(fontName), size=fontSize)

    lines = wrapText(text)
    bgWidth, bgHeight = background.size

    numLines = len(lines)
    middle = numLines / 2 + 0.5
    counter = 0
    buffer = 75
    for line in lines:
        #print(line)
        lineWidth, lineHeight = draw.textsize(line, font)
        textPlacement = ((bgWidth - lineWidth) / 2, (bgHeight + ((lineHeight + buffer)*(-numLines + middle + counter))) / 2)
        draw.text(textPlacement, line, fill=textColor, font=font)
        counter += 1

    return background # now with text!
#################################### End of Function ####################################

def textToVideo(duration, text, fadeIn=True, fadeOut=True):
    imageName = str(videosDir / "text.png")
    textImage = addText(background.copy(), text)
    textImage.save(imageName)
    textClip = ImageClip(imageName).set_duration(duration)
    textClip = textClip.resize(height=vidHeight,width=vidWidth)
    if (fadeIn):
        textClip = fx.all.fadeout(textClip, 0.3, final_color=None)
    if (fadeOut):
        textClip = fx.all.fadeout(textClip, 0.3, final_color=None)
    return textClip
#################################### End of Function ####################################

def genHash():
    size = 5
    h = ""
    for i in range(size):
        h = h + (random.choice(string.ascii_letters))
    h = str(abs(hash(h)))[0:5]
    return h
#################################### End of Function ####################################

def startUp():
    if not os.path.exists(weaveTEMP):
        os.makedirs(weaveTEMP)

def cleanUp():
    storage_access.removeTempDir()
    storage_access.deleteFile(indexesPath)

# converts a list of lists into a list of files
def listOfFiles(aList):
    length = len(aList)
    listOfFiles = []
    if (length <= maxWorkers):
        #make each its own file
        for i in range(0, length):
            with open(weaveTEMP / str(i), "wb") as fp:
                pickle.dump([aList[i]], fp)
            listOfFiles.append(str(i))
    else:
        # # just split them as evenly as you can
        # step = length//maxWorkers # rounds towards 0
        # for i in range(step, length-step, step): # only go 15 times
        #     with open(weaveTEMP / str(i), "wb") as fp:
        #         pickle.dump(aList[i-step:i], fp)
        #     listOfFiles.append(str(i))
        # # put the remaining in the final file
        # with open(weaveTEMP / str(step*maxWorkers), "wb") as fp:
        #     pickle.dump(aList[step*(maxWorkers-1):], fp)
        # listOfFiles.append(str(step*maxWorkers))
        step = length//maxWorkers # rounds towards 0
        for w in range(0, maxWorkers - 1):
            with open(weaveTEMP / str(w), "wb") as fp:
                index = w*step
                pickle.dump(aList[index:index+step], fp)
            listOfFiles.append(str(w))
        # give all the remaining to the final process
        with open(weaveTEMP / str(maxWorkers-1), "wb") as fp:
            pickle.dump(aList[(maxWorkers-1)*step:], fp)
        listOfFiles.append(str(maxWorkers-1))

    return listOfFiles

# converts a list of files into a list of lists
def listOfLists(aList):
    listOfLists = []
    for aFile in aList:
        lst = []
        try:
            with open(weaveTEMP / aFile, "rb") as fp:
                lst = pickle.load(fp)
            storage_access.deleteFile(str(weaveTEMP / aFile))
            for l in lst:
                listOfLists.append(l)
        except Exception as e:
            print("ERROR: Likely multiprocessing ended abruptly. Error Listed below.")
            print(e)
            print()
    return listOfLists


# if csv, call parse CSV
# if xlsx, call parse xlsx
# check if file already exists and ask for permission to overwrite it
# (delete it and just make a new one)
def parseFile():
    startUp()
    ### Find the donors file ###
    if (len(sys.argv) != 2):
        print("ERROR: incorrect number of perameters")
        print("Usage: python3 weave.py <pathTo/donorFile OR donorFile> <pathTo/indexes.txt OR indexes.txt>\n If file contains spaces, use single quotes e.g. path/'file name has spaces.xlsx'")
        return

    path = Path(sys.argv[1])

    if (path.is_file() == False):
        print("ERROR: The donor file provided in the first argument cannot be found")
        print(path)
        return

    if (str(path)[-4:] == csvFile):
        parseCSV(path)
    elif (str(path)[-5:] == xlsxFile):
        parseXLSX(path)
    else:
        print("ERROR: The file type passed in is not supported by this program")
        print("Tip: Enter a .csv or .xlsx file")
    cleanUp()

#################################### End of Function ####################################

def outputDNE(inputPath, fileType):
    outputPath = Path(str(inputPath)[:-len(fileType)] + outputExtension + fileType)
    if (outputPath.is_file() == False):
        return True
    else:
        print("The file: " + str(outputPath) + "\nalready exists.\nIs it okay to overwrite this file? (y/n): ",end="")
        answer = input().lower()
        if (answer == "y"):
            try:
                os.remove(outputPath)
                return True
            except:
                print("ERROR: program was unable to delete the existing file.")
                print("Tip: Delete or rename the file then try running again.")
        else:
            print("...Terminating the program...")
            print("Tip: Delete or rename the file then try running again.")
    return False
#################################### End of Function ####################################

def initIndexes(row):
    global firstNameIndex
    global lastNameIndex
    global gradYearIndex

    while (True):
        print("Column containing first names (A,B,C,...,AA,BB,CC,...):", end=" ")
        firstNameCol = input().lower()
        print("Column containing last names (A,B,C,...,AA,BB,CC,...):", end=" ")
        lastNameCol = input().lower()
        print("Column containing graduation years (A,B,C,...,AA,BB,CC,...):", end=" ")
        gradYearCol = input().lower()

        try:
            firstNameIndex = (len(firstNameCol) - 1)*26
            for char in firstNameCol:
                firstNameIndex += ord(char) - 97
            lastNameIndex = (len(lastNameCol) - 1)*26
            for char in lastNameCol:
                lastNameIndex += ord(char) - 97
            gradYearIndex = (len(gradYearCol) - 1)*26
            for char in gradYearCol:
                gradYearIndex += ord(char) - 97
        except:
            print("ERROR: unable to convert the column letter to an integer index.")
            return False

        if (verifyIndexes(row)):
            #write the indexes to the file
            if (indexesPath.is_file()):
                os.remove(indexesPath)
            with open(indexesPath, 'w') as indexFile:
                indexFile.write(str(firstNameIndex) + "\n")
                indexFile.write(str(lastNameIndex) + "\n")
                indexFile.write(str(gradYearIndex))
            return True
        else:
            print("Input rows again? (y/n):", end=" ")
            answer = input().lower()
            if (answer == "n"):
                return False
            elif (answer != "y"):
                print("ERROR: invalid input expected 'y' for yes or 'n' for no.")
                print("...Terminating the program...")
#################################### End of Function ####################################

def verifyIndexes(row):
    while(True):
        print("Do all values for the first Donor look correct?")
        print("First Name: " + str(row[firstNameIndex]))
        print("Last Name: " + str(row[lastNameIndex]))
        print("Graduation Year: " + str(row[gradYearIndex]))
        print(str(firstNameIndex) + " " + str(lastNameIndex) + " " + str(gradYearIndex))
        print("(y/n): ", end="")
        answer = input().lower()
        if (answer == "y"):
            return True
        elif (answer == "n"):
            return False
        else:
            print("ERROR: invalid input expected 'y' for yes or 'n' for no")
#################################### End of Function ####################################

def parseXLSX(inputPath):
    start = datetime.now()
    outputPath = Path(str(inputPath)[:-5] + outputExtension + xlsxFile)

    newRows = []
    donorsFile = pd.read_excel(inputPath, engine='openpyxl').dropna(how='all') # drop all nan (empty) rows
    dfRows = donorsFile.values.tolist()
    if((not initIndexes(dfRows[0])) or (not outputDNE(inputPath, xlsxFile))):
        return

    dfDividedRows = listOfFiles(dfRows)
    # print(dfDividedRows)

    # # For testing
    # with cf.ProcessPoolExecutor(max_workers=maxWorkers) as exe:
    #     finished = exe.map(weaveVideo, dfDividedRows)
    #     for proc in finished:
    #         print("A PROCESS HAS FINISHED")

    try:
        with cf.ProcessPoolExecutor(max_workers=maxWorkers) as exe:
            finished = exe.map(weaveVideo, dfDividedRows)
            for proc in finished:
                print("A PROCESS HAS FINISHED")
            # exe.map(weaveVideo, dfDividedRows)
            # exe.shutdown()
    except Exception as e:
        print("ERROR: issue while multiprocessing. Error listed below.")
        print(e)
        print()

    newRows = listOfLists(dfDividedRows)
    #print(newRows)
    pd.DataFrame(newRows).to_excel(outputPath,index=False)

    finish = datetime.now()
    print("Finished in (hh:mm:ss.ms): " + str(finish - start))
#################################### End of Function ####################################

def parseCSV(inputPath):
    start = datetime.now()
    outputPath = Path(str(inputPath)[:-4] + outputExtension + csvFile)
    #with open('./csv-files/CS Give Day Test Data - Alumni - sample.xlsx', 'r', encoding="utf8") as inputCSV:
    with open(inputPath, 'r', encoding="utf8") as inputCSV:
        donors = csv.reader(inputCSV, delimiter=",")
        with open(outputPath, 'w', newline='', encoding="utf8") as outputCSV:
            output = csv.writer(outputCSV, delimiter=",")
            row = next(donors)
            row.append("Video Link")
            output.writerow(row)

            if((not initIndexes(row)) and (not outputDNE(csvFile))):
                return

            with cf.ProcessPoolExecutor() as exe:
                #rows = exe.map(weaveVideo, donors)
                exe.map(weaveVideo, donors)
                exe.shutdown()
                # for row in rows:
                #     output.writerow(row)

    finish = datetime.now()
    print("Finished in (hh:mm:ss.ms): " + str(finish - start))
#################################### End of Function ####################################

def urlFormat(str):
    # Eliminate characters that don't in the url
    str = str.replace(" ", "%20")
    str = str.replace("'", "%27")
    return str

# removes the leading and following spaces
def removeExcessSpaces(aStr):
    while (aStr[-1] == " "):
        aStr = aStr[:-1]
    while (aStr[0] == " "):
        aStr = aStr[1:]
    return aStr

def weaveVideoTest(fileName):
    rows = []
    with open(weaveTEMP / fileName, "rb") as fp:
        rows = pickle.load(fp)
    for row in rows:
        row.append(fileName)
    with open(weaveTEMP / fileName, "wb") as fp:
        pickle.dump(rows,fp)
    # return row

# Takes in a row as a list
# pass in all the other info we may want for the videos
def weaveVideo(rowsFile):
    # Make file for storing videos and photos stored by the process
    global videosDir
    videosDir = storage_access.makeDir()

    print()
    print(rowsFile)

    # if initIndexes() has been called
    indexes = []
    with open(indexesPath, 'r') as fp:
        indexes = fp.readlines()
    rows = []
    with open(weaveTEMP / rowsFile, "rb") as fp:
        rows = pickle.load(fp, encoding='bytes')
    with open(weaveTEMP / rowsFile, "wb") as fp:
        pickle.dump([], fp)

    for row in rows:
        firstName = removeExcessSpaces(str(row[int(indexes[0])]))
        lastName = removeExcessSpaces(str(row[int(indexes[1])]))
        gradYear = removeExcessSpaces(str(row[int(indexes[2])]))

        contentList = []
        editedContentList = []
        videoName = firstName + "_" + lastName +  "_" + genHash() #to add a hash
        videoName = urlFormat(videoName)

        # get content from firebase and store in content list and videosDir
        storage_access.downloadContentFromStor(videosDir, "v", contentList, gradYear, 4) # localDestination, "v" for videos, 5 for amount

        # photos currently aren't working, since there's only a few of them and they are hard to make look good in the video
        #storage_access.downloadContentFromStor(videosDir, "p", contentList, gradYear, 2) # localDestination, "p" for photos, 2 for amount

        storage_access.downloadContentFromStor(videosDir, "t", contentList, gradYear, 1) # localDestination, "t" for thank you videos, 1 for amount

        #### BEGINNING OF VIDEO WEAVING ####
        print("Making video for: " + firstName + " " + lastName)

        # In case something goes wrong and the text doesn't update, here is generic backup text
        gradText = "CS at Western continually modernizes itself to cultivate young minds and prepare students for successful careers in an ever-changing world."

        try:
            gradYear = int(float(gradYear))
            yearsSinceGrad = curYear - gradYear
            # Check for how long ago the alumni graduated from Western (if at all) to make the intro text more personalized
            if(yearsSinceGrad <= 1):
                gradText = "Congratulations on graduating this past year. CS at Western has continued to grow and expand, all the while cultivating young minds and preparing students for successful careers."
            elif(yearsSinceGrad < 10):
                gradText = "Since your graduation only " + str(yearsSinceGrad) + " years ago, CS at Western has continued to grow and expand, all the while cultivating young minds and preparing students for successful careers."
            elif(yearsSinceGrad >= 10):
                gradText = "Since your graduation " + str(yearsSinceGrad) + " years ago, CS at Western has grown and expanded, all the while cultivating young minds and engaging students with the newest technologies."
        except:
            gradText = "As a friend and supporter of CS at Western, you have helped cultivate young minds and prepare students for successful careers."

        text = "This is a special video message for you, " + firstName + "!"
        editedContentList.append(textToVideo(3, text, fadeIn=False))
        editedContentList.append(textToVideo(7, gradText))

        for i, vid in enumerate(contentList):
            print("Adding video: " + contentList[i].name)
            if ('.MOV' in contentList[i].name or '.mp4' in contentList[i].name):
                # Current settings (can be changed if needed): 720p 30fps with ~0.3 seconds fade in/out
                # For best results, record videos in resolution greater than vidHeight x vidWidth to avoid having to upscale
                editedVideo = VideoFileClip(str(videosDir / contentList[i].name))
                editedVideo = editedVideo.set_fps(30)
                editedVideo = editedVideo.resize(height=vidHeight,width=vidWidth)
                editedVideo = editedVideo.fx(afx.audio_normalize)
                editedVideo = fx.all.fadein(editedVideo, 0.3, initial_color=None)
                editedVideo = fx.all.fadeout(editedVideo, 0.3, final_color=None)
                editedContentList.append(editedVideo)
            elif ('.jpg' in contentList[i].name or '.png' in contentList[i].name):
                imageClip = VideoFileClip(str(videosDir / contentList[i].name))
                imageClip = imageClip.set_fps(30)
                imageClip = imageClip.resize(height=vidHeight,width=vidWidth)
                imageClip = imageClip.fx(afx.audio_normalize)
                imageClip = fx.all.fadein(imageClip, 0.3, initial_color=None)
                imageClip = fx.all.fadeout(imageClip, 0.3, final_color=None)
                editedContentList.append(imageClip)

        #Remove extra thank you video so we can put it after the donation message
        del editedContentList[-1]

        text = "Your donation could help shape the future of computer science!"
        editedContentList.append(textToVideo(3, text))

        thanksClip = VideoFileClip(str(videosDir / contentList[-1].name))
        print("Final clip added. Formatting...")
        thanksClip = thanksClip.set_fps(30)
        thanksClip = thanksClip.resize(height=vidHeight,width=vidWidth)
        thanksClip = thanksClip.fx(afx.audio_normalize)
        thanksClip = fx.all.fadein(thanksClip, 0.3, initial_color=None)
        thanksClip = fx.all.fadeout(thanksClip, 0.3, final_color=None)
        editedContentList.append(thanksClip)

        print("Adding final QR code clip...")
        qrClip = ImageClip(str(qrPath)).set_duration(4)
        qrClip = qrClip.resize(height=vidHeight,width=vidWidth)
        editedContentList.append(qrClip)

        final_clip = concatenate_videoclips(editedContentList, method='compose')

        # Combine the audio from the video with the music. This needs to be done last otherwise each clip will have the same few seconds of music
        music = AudioFileClip(str(musicPath)).set_duration(final_clip.duration)
        # Music volume depends on the music used. For "Corn Dogs in Santa Monica", it needs to be at 0.1x volume otherwise it's too loud
        music = afx.volumex(music,0.1)
        new_audio = CompositeAudioClip([final_clip.audio,music])
        final_clip = final_clip.set_audio(new_audio)

        # put the video in the finished video folder
        # WARNING: Audio codec must NOT be set to default, otherwise videos won't play on iOS devices for some reason
        final_clip.write_videofile(str(videosDir / (videoName + ".mp4")), audio_codec='aac') #universal

        #### END OF VIDEO WEAVING ####

        # upload that video to FB finished video folder
        storage_access.uploadToStor(videosDir, videoName + ".mp4")

        # clear weaveDir and uploadDir
        time.sleep(0.5) # Give time for process to stop using things in the background
        storage_access.clearDir(videosDir)

        # Append the URL to the output csv
        row.append(websiteURL + videoName)

        temp = []
        with open(weaveTEMP / rowsFile, "rb") as fp:
            temp = pickle.load(fp)
        temp.append(row)
        print(temp)
        with open(weaveTEMP / rowsFile, "wb") as fp:
            pickle.dump(temp, fp)
    storage_access.deleteDir(videosDir)
    #return rowsFile # No longer returning to send less data
#################################### End of Function ####################################
#
# Andrew was here.
#
if __name__ == "__main__":
    parseFile()